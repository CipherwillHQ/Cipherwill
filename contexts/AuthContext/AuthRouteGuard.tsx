"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthUser } from "./types";

export function AuthRouteGuard({
  isPrivateRoute,
  isLoading,
  user,
  pathname,
  children,
}: {
  isPrivateRoute: boolean;
  isLoading: boolean;
  user: AuthUser;
  pathname: string | null;
  children?: ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (isPrivateRoute && !isLoading && !user) {
      router.replace("/auth?redirect=" + pathname);
    }
  }, [isLoading, isPrivateRoute, pathname, router, user]);

  if (!isPrivateRoute) return <>{children}</>;
  if (isLoading) return null;
  if (!user) return null;

  return <>{children}</>;
}

