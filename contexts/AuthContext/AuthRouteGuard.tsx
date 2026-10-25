// Guards private routes and requires email verification for executor pages.
// Owns redirects before executor providers and content mount.
// Does not replace backend authorization.
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
  const needsExecutorVerification = (pathname === "/executor" || pathname?.startsWith("/executor/"))
    && user?.emailVerified !== true;

  useEffect(() => {
    if (isPrivateRoute && !isLoading && !user) {
      router.replace("/auth?redirect=" + pathname);
    } else if (isPrivateRoute && !isLoading && user && needsExecutorVerification) {
      router.replace("/auth/verify-email?redirect=" + encodeURIComponent(pathname || "/executor"));
    }
  }, [isLoading, isPrivateRoute, pathname, router, user, needsExecutorVerification]);

  if (!isPrivateRoute) return <>{children}</>;
  if (isLoading) return null;
  if (!user) return null;
  if (needsExecutorVerification) return null;

  return <>{children}</>;
}

