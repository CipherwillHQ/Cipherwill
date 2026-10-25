// Observes Firebase identity after the optional native session handoff.
// Owns authentication loading state and token-change subscriptions.
// Does not exchange credentials or implement application account setup.
"use client";

import { useEffect, useState } from "react";
import { authApp } from "./firebase";
import { AuthUser } from "./types";
import { initializeMobileAuth } from "@/common/auth/initializeMobileAuth";

export function useAuthState() {
  const [user, setUser] = useState<AuthUser>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};
    initializeMobileAuth(authApp).then(() => {
      if (!active) return;
      unsubscribe = authApp.onIdTokenChanged(async (currentUser) => {
        if (currentUser && currentUser.email) {
          setUser({ uid: currentUser.uid, email: currentUser.email, emailVerified: currentUser.emailVerified });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
    }).catch(() => {
      if (!active) return;
      setUser(null);
      setIsLoading(false);
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  return { user, isLoading, isGoogleLoading, setIsGoogleLoading };
}
