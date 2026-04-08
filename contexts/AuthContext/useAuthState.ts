"use client";

import { useEffect, useState } from "react";
import { authApp } from "./firebase";
import { AuthUser } from "./types";

export function useAuthState() {
  const [user, setUser] = useState<AuthUser>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authApp.onIdTokenChanged(async (currentUser) => {
      if (currentUser && currentUser.email) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    isLoading,
    isGoogleLoading,
    setIsGoogleLoading,
  };
}

