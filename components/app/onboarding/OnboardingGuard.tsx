/**
 * App-level onboarding gate for /app pages.
 * Renders onboarding fullscreen in place until completion.
 */
"use client";

import { useQuery } from "@apollo/client/react";
import GET_MY_ONBOARDING from "@/graphql/ops/auth/queries/GET_MY_ONBOARDING";
import FullscreenLoader from "@/components/loaders/FullscreenLoader";
import OnboardingFlow from "./OnboardingFlow";

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useQuery(GET_MY_ONBOARDING);

  const isCompleted = (data as any)?.getMyOnboarding?.is_completed;

  if (error) return <>{children}</>;
  if (loading) {
    return <FullscreenLoader />;
  }
  if (isCompleted === false) return <OnboardingFlow />;

  return <>{children}</>;
}
