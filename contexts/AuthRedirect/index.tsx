"use client";

import { createContext, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import FullscreenLoader from "@/components/loaders/FullscreenLoader";

const AuthRedirectContext = createContext<any>({});

export function AuthRedirectProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isLoading } = useAuth();
  const isLoggedin = !!user;

  const value = {};

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth?redirect=" + pathname);
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || !isLoggedin) return <FullscreenLoader />;
  // return <FullscreenLoader />;

  return (
    <AuthRedirectContext.Provider value={value}>
      {children}
    </AuthRedirectContext.Provider>
  );
}
