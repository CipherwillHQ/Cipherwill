// Provides authentication actions and tracks successful authentication outcomes.
// Owns Firebase calls, backend email requests, loading state, and conversion callbacks.
// Does not initialize profiles or choose post-login destinations.
"use client";

import { useCallback, useMemo } from "react";
import {
  GoogleAuthProvider,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  getIdToken,
  type UserCredential,
} from "firebase/auth";
import { usePostHog } from "posthog-js/react";
import trackSignupConversion from "@/common/analytics/trackSignupConversion";
import { authApp } from "./firebase";
import { handle_firebase_error } from "./errors";
import requestPasswordReset from "@/common/auth/requestPasswordReset";
import { requestMobileAuth } from "@/common/auth/mobileAuthBridge";

type LoginConversionFn = (method: string) => Promise<void>;

type AuthActionsDependencies = {
  setIsGoogleLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loginConversion: LoginConversionFn;
  signupConversion?: (credential: UserCredential) => Promise<void>;
  onLogout?: () => void;
};

export function createAuthActions({
  setIsGoogleLoading,
  loginConversion,
  signupConversion,
  onLogout,
}: AuthActionsDependencies) {
  return {
    login: () => {},
    createUserWithEmailAndPassword: async (email: string, password: string) => {
      try {
        const credential = await createUserWithEmailAndPassword(authApp, email, password);
        await signupConversion?.(credential);
        return credential;
      } catch (error) {
        return handle_firebase_error(error);
      }
    },
    signInWithEmailAndPassword: async (email: string, password: string) => {
      try {
        return await signInWithEmailAndPassword(authApp, email, password).then(
          async function onSuccess(credential) {
            await signupConversion?.(credential);
            loginConversion("email");
          }
        );
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          try {
            const credential = await createUserWithEmailAndPassword(authApp, email, password);
            await signupConversion?.(credential);
            return credential;
          } catch (innerError) {
            return handle_firebase_error(innerError);
          }
        } else {
          return handle_firebase_error(error);
        }
      }
    },
    sendEmailVerification: async () => {
      if (!authApp || !authApp.currentUser) return;
      try {
        return await sendEmailVerification(authApp.currentUser);
      } catch (error) {
        return handle_firebase_error(error);
      }
    },
    sendPasswordResetEmail: requestPasswordReset,
    googleLogin: async () => {
      if (!authApp) return;
      setIsGoogleLoading(true);
      try {
        const provider = new GoogleAuthProvider();
        provider.addScope("email");
        return await signInWithPopup(authApp, provider).then(
          async function onSuccess(credential) {
            await signupConversion?.(credential);
            loginConversion("google");
            setIsGoogleLoading(false);
          }
        );
      } catch (error) {
        setIsGoogleLoading(false);
        return handle_firebase_error(error);
      }
    },
    loginwithCustomToken: async (token) => {
      if (!authApp) return;
      try {
        return await signInWithCustomToken(authApp, token).then(
          async function onSuccess(credential) {
            await signupConversion?.(credential);
            loginConversion("custom token");
          }
        );
      } catch (error) {
        return handle_firebase_error(error);
      }
    },
    getJWT: async () => await authApp?.currentUser?.getIdToken(),
    logout: async () => {
      onLogout?.();
      await authApp?.signOut();
      await requestMobileAuth("logout");
    },
    getIdToken: async (force = false) => {
      if (!authApp || !authApp.currentUser) return;
      return await getIdToken(authApp.currentUser, force);
    },
  };
}

export function useAuthActions({
  setIsGoogleLoading,
}: {
  setIsGoogleLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const posthog = usePostHog();

  const signupConversion = useCallback(
    (credential: UserCredential) => trackSignupConversion(credential, posthog),
    [posthog]
  );

  const loginConversion = useCallback(
    async (method: string) => {
      posthog.capture("login", {
        method,
      });
    },
    [posthog]
  );

  const onLogout = useCallback(() => {
    posthog.reset();
  }, [posthog]);

  return useMemo(
    () =>
      createAuthActions({
        setIsGoogleLoading,
        loginConversion,
        signupConversion,
        onLogout,
      }),
    [loginConversion, signupConversion, onLogout, setIsGoogleLoading]
  );
}

