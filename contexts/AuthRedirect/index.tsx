"use client";

import { createContext, useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import FullscreenLoader from "@/components/loaders/FullscreenLoader";

const AuthRedirectContext = createContext<any>({});

export function AuthRedirectProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isLoading } = useAuth();
  const [isLoggedin, setisLoggedin] = useState(false);

  const value = {};

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth?redirect=" + pathname);
    }
    if (!isLoading && user) {
      setisLoggedin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user]);

  if (!isLoggedin) return <FullscreenLoader />;
  // return <FullscreenLoader />;

  return (
    <AuthRedirectContext.Provider value={value}>
      {children}
    </AuthRedirectContext.Provider>
  );
}
