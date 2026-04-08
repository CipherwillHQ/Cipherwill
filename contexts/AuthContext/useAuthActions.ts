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
  sendPasswordResetEmail,
} from "firebase/auth";
import { useMixpanel } from "../MixpanelContext";
import { usePostHog } from "posthog-js/react";
import { authApp } from "./firebase";
import { handle_firebase_error } from "./errors";

type LoginConversionFn = (method: string) => Promise<void>;

type AuthActionsDependencies = {
  setIsGoogleLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loginConversion: LoginConversionFn;
  onLogout?: () => void;
};

export function createAuthActions({
  setIsGoogleLoading,
  loginConversion,
  onLogout,
}: AuthActionsDependencies) {
  return {
    login: () => {},
    createUserWithEmailAndPassword: async (email: string, password: string) => {
      try {
        return await createUserWithEmailAndPassword(authApp, email, password);
      } catch (error) {
        return handle_firebase_error(error);
      }
    },
    signInWithEmailAndPassword: async (email: string, password: string) => {
      try {
        return await signInWithEmailAndPassword(authApp, email, password).then(
          function onSuccess() {
            loginConversion("email");
          }
        );
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          try {
            return await createUserWithEmailAndPassword(authApp, email, password);
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
    sendPasswordResetEmail: async (email: string) => {
      try {
        return await sendPasswordResetEmail(authApp, email);
      } catch (error) {
        return handle_firebase_error(error);
      }
    },
    googleLogin: async () => {
      if (!authApp) return;
      setIsGoogleLoading(true);
      try {
        const provider = new GoogleAuthProvider();
        provider.addScope("email");
        return await signInWithPopup(authApp, provider).then(
          function onSuccess() {
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
          function onSuccess() {
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
  const mixpanel = useMixpanel();
  const posthog = usePostHog();

  const loginConversion = useCallback(
    async (method: string) => {
      if (mixpanel) {
        mixpanel.track("login", {
          method,
        });
      }
      posthog.capture("login", {
        method,
      });
    },
    [mixpanel, posthog]
  );

  const onLogout = useCallback(() => {
    mixpanel.reset();
    posthog.reset();
  }, [mixpanel, posthog]);

  return useMemo(
    () =>
      createAuthActions({
        setIsGoogleLoading,
        loginConversion,
        onLogout,
      }),
    [loginConversion, onLogout, setIsGoogleLoading]
  );
}

