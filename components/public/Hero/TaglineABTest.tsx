"use client";

import { useFeatureFlagVariantKey } from "posthog-js/react";

export default function TaglineABTest() {
  const variant = useFeatureFlagVariantKey("hero-tagline-conversion");

  if (variant === "control") {
    return "Inheritance Plan for your digital life";
  } else if (variant === "line_1") {
    return "A Will for Your Digital Life";
  } else if (variant === "line_2") {
    return `What happens to your secrets\nWhen you die?`;
  } else if (variant === "line_3") {
    return "Digital Dead Man's Switch";
  } else {
    return "Inheritance Plan for your digital life";
  }
}