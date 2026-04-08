"use client";

//TODO: remove encoding package and track issue - https://github.com/supabase/supabase-js/issues/612

import React, { ReactNode, createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { privateRoutes } from "./firebase";
import { useAuthState } from "./useAuthState";
import { useAuthActions, createAuthActions } from "./useAuthActions";
import { AuthRouteGuard } from "./AuthRouteGuard";

const AuthContext = createContext<any>({});

interface Props {
  children?: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const isPrivateRoute = privateRoutes.some((path) =>
    pathname === path || pathname?.startsWith(`${path}/`)
  );

  const { user, isLoading, isGoogleLoading, setIsGoogleLoading } =
    useAuthState();
  const actions = useAuthActions({ setIsGoogleLoading });

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isGoogleLoading,
      ...actions,
    }),
    [actions, isGoogleLoading, isLoading, user]
  );

  return (
    <AuthContext.Provider value={value}>
      <AuthRouteGuard
        isPrivateRoute={isPrivateRoute}
        isLoading={isLoading}
        user={user}
        pathname={pathname}
      >
        {children}
      </AuthRouteGuard>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { createAuthActions } from "./useAuthActions";
export { useAuthState } from "./useAuthState";
