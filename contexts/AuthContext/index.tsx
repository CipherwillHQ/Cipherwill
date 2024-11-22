"use client";

//TODO: remove encoding package and track issue - https://github.com/supabase/supabase-js/issues/612

import React, {
  useContext,
  useState,
  useEffect,
  ReactNode,
  createContext,
  useCallback,
} from "react";
import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  getIdToken,
  sendPasswordResetEmail,
} from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useMixpanel } from "../MixpanelContext";
import toast from "react-hot-toast";
import { usePostHog } from "posthog-js/react";

const AuthContext = createContext<any>({});

const firebaseConfig = {
  apiKey: "AIzaSyD6vj8FeXx58g3zpDvIDFn6qIVRPZ4fUmk",
  authDomain: "auth.cipherwill.com",
  projectId: "project-cipherwill",
  storageBucket: "project-cipherwill.appspot.com",
  messagingSenderId: "200526322095",
  appId: "1:200526322095:web:adedd3c4f769d6d9a3775a",
  measurementId: "G-HET0PM9EPK",
};

const app = initializeApp(firebaseConfig, "project-cipherwill");
const authApp = getAuth(app);

interface Props {
  children?: ReactNode;
}

const privateRoutes = [
  "/studio",
  "/notifications",
  "/settings",
  "/subscriptions",
];

function handle_firebase_error(error) {
  if (error.code === "auth/user-not-found") {
    return {
      error: "User not found. Please sign up first.",
    };
  } else if (error.code === "auth/invalid-email") {
    return {
      error: "Email is invalid",
    };
  } else if (error.code === "auth/wrong-password") {
    return {
      error: "Password is invalid",
    };
  } else if (error.code === "auth/email-already-in-use") {
    return {
      error: "Email already in use",
    };
  } else if (error.code === "auth/popup-closed-by-user") {
    return {
      error: "Authentication request declined by user",
    };
  } else if (error.code === "auth/user-cancelled") {
    return {
      error: "Authentication request declined by user",
    };
  } else if (error.code === "auth/weak-password") {
    return {
      error: "Password should be at least 6 characters",
    };
  } else if (error.code === "auth/popup-blocked") {
    toast.error("Popup blocked by browser");
    return {
      error: "Popup blocked by browser",
    };
  } else if (error.code === "auth/too-many-requests") {
    return {
      error: "Too many requests! Please try again in a few minutes.",
    };
  } else if (error.code === "auth/network-request-failed") {
    return {
      error: "Network request failed. Please try again in a few minutes.",
    };
  } else {
    throw error;
  }
}

export function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const IsPrivateRoute = privateRoutes.some((path) =>
    pathname.startsWith(path)
  );

  const mixpanel = useMixpanel();
  const posthog = usePostHog();
  const router = useRouter();
  const [user, setUser] = useState<
    | {
        uid: string;
        email: string;
      }
    | null
    | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const login_conversion = useCallback(
    async (method: string) => {
      if (mixpanel)
        mixpanel.track("login", {
          method: method,
        });
      posthog.capture("login", {
        method: method,
      });
    },
    [mixpanel]
  );

  useEffect(() => {
    // check initial user
    loadAuth();
  }, []);

  async function loadAuth() {
    authApp.onIdTokenChanged(async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
  }

  // Will be passed down to Signup, Login and App components
  const value = {
    user,
    isLoading,
    isGoogleLoading,
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
            login_conversion("email");
          }
        );
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          try {
            return await createUserWithEmailAndPassword(
              authApp,
              email,
              password
            );
          } catch (error) {
            return handle_firebase_error(error);
          }
        } else {
          return handle_firebase_error(error);
        }
      }
    },
    sendEmailVerification: async () => {
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
            login_conversion("google");
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
            login_conversion("custom token");
          }
        );
      } catch (error) {
        return handle_firebase_error(error);
      }
    },
    getJWT: async () => await authApp?.currentUser?.getIdToken(),
    logout: async () => {
      mixpanel.reset();
      posthog.reset();
      await authApp?.signOut();
      // window.location.reload();
    },
    getIdToken: async (force = false) => {
      return await getIdToken(authApp.currentUser, force);
    },
  };

  // all public pages
  if (!IsPrivateRoute) {
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

  if (isLoading) return <div>Auth Context Loading...</div>;
  if (!isLoading && !user) {
    router.replace("/login?redirect=" + pathname);
    return null;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
