// What it does: Gates /app between the classic dashboard and GuidedActions for the A/B test.
// What it owns: Waiting briefly for the PostHog experiment variant before rendering the selected home.
// What it does NOT do: Define dashboard widgets or manage PostHog initialization.
"use client";

import type { ReactNode } from "react";
import GuidedActions from "@/components/app/GuidedActions";
import { useHomeGuideExperiment } from "@/common/analytics/useHomeGuideExperiment";

export default function HomeGuideGate({ children }: { children: ReactNode }) {
  const { ready, isGuideHome } = useHomeGuideExperiment();

  if (!ready) return null;
  if (isGuideHome) return <GuidedActions />;

  return <>{children}</>;
}
