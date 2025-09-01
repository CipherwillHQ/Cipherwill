// This file configures the initialization of Sentry and PostHog on the client.
// The added config here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
// https://posthog.com/docs/integrations/js-integration

import posthog from "posthog-js";
import * as Sentry from "@sentry/nextjs";

// Initialize PostHog
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  ui_host: "https://us.posthog.com",
  defaults: "2025-05-24",
  person_profiles: "identified_only",
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: "*",
  },
  mask_all_element_attributes: true,
  mask_all_text: true,
  capture_exceptions: true, // Enables capturing exceptions using Error Tracking
  debug: process.env.NODE_ENV === "development",
});

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
