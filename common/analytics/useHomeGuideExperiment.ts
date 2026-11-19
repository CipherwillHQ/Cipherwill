// What it does: Resolves the PostHog A/B test variant for making Guide the /app homepage.
// What it owns: Flag evaluation, variant interpretation, and a timeout fallback to control.
// What it does NOT do: Render dashboard UI or modify PostHog configuration.
"use client";

import { useEffect, useState } from "react";
import { useFeatureFlagVariantKey } from "posthog-js/react";

export const HOME_GUIDE_EXPERIMENT_FLAG = "home-guide-experiment";
const FLAG_FALLBACK_TIMEOUT_MS = 800;

export function isGuideHomeVariant(variant: string | boolean | undefined): boolean {
  return variant === "guide" || variant === "test" || variant === true;
}

export function useHomeGuideExperiment() {
  const variant = useFeatureFlagVariantKey(HOME_GUIDE_EXPERIMENT_FLAG);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (variant !== undefined) return;
    const timer = window.setTimeout(() => setTimedOut(true), FLAG_FALLBACK_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [variant]);

  return {
    variant,
    ready: variant !== undefined || timedOut,
    isGuideHome: isGuideHomeVariant(variant),
  };
}
