"use client";
import { IS_PRODUCTION } from "@/common/constant";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined" && IS_PRODUCTION) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    debug: !IS_PRODUCTION,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "*",
    },
    mask_all_element_attributes: true,
    mask_all_text: true,
  });
}
export function CSPostHogProvider({ children }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
