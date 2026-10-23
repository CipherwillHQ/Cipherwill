// Presents the overview and guided setup throughout the /app/guide content area.
// Owns overview/objective transitions and privacy-safe completion analytics.
// Does not store plaintext drafts or decide questions on the server.
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import MobileFloatingMenu from "@/components/app/Sidebar/MobileFloatingMenu";
import GuidePanel from "./components/GuidePanel";
import GuideOverviewSlide from "./components/GuideOverviewSlide";
import useObjectiveEngine from "./hooks/useObjectiveEngine";
import useGuidedTimedDisplay from "./hooks/useGuidedTimedDisplay";

export default function GuidedActions() {
  const { user } = useAuth();
  const { session } = useSession();
  const identity = `${user?.uid ?? user?.id ?? user?.email ?? ""}:${session?.publicKey ?? "null"}`;
  return <GuidedActionsView key={identity} />;
}

function GuidedActionsView() {
  const [active, setActive] = useState(false);
  const completedInSession = useRef(false);
  const trackedObjectives = useRef(new Set<string>());
  const posthog = usePostHog();
  const { current, started, deferred, loading, error, postActionStatus, engine } = useObjectiveEngine();

  const returnToOverview = useCallback(() => {
    posthog.capture("assistant_closed", { source: "guided_actions", completed_objective_in_session: completedInSession.current });
    setActive(false);
  }, [posthog]);
  const start = useCallback(() => {
    posthog.capture("assistant_opened", { source: "guided_actions" });
    setActive(true);
    if (error) void engine.retry();
    else void engine.prepareContext();
  }, [posthog, engine, error]);
  const advance = useCallback(() => engine.continue(), [engine]);
  const retry = useCallback(() => engine.retry(), [engine]);
  const defer = useCallback(() => engine.defer(), [engine]);
  const startObjective = useCallback(() => engine.start(), [engine]);
  const resume = useCallback(async (id: string) => {
    await engine.resume(id);
    setActive(true);
  }, [engine]);

  useEffect(() => {
    if (!active || !current) return;
    if (current.result.action !== "complete" || !current.result.displayForMs) return;
    completedInSession.current = true;
    if (trackedObjectives.current.has(current.objectiveId)) return;
    trackedObjectives.current.add(current.objectiveId);
    posthog.capture("objective_completed", { source: "guided_actions", objective_id: current.objectiveId });
  }, [current, active, posthog]);
  useEffect(() => {
    if (!active || current || loading || error) return;
    const timer = window.setTimeout(returnToOverview, 0);
    return () => window.clearTimeout(timer);
  }, [active, current, loading, error, returnToOverview]);

  useGuidedTimedDisplay(active, current, error, advance);

  return <main className="cw-private-guidance ph-no-capture sentry-block relative flex min-h-full w-full flex-1 flex-col bg-dashboardCream dark:bg-darkCanvas">
    <div className="absolute left-5 top-5 z-10 sm:hidden"><MobileFloatingMenu /></div>
    {active ? <GuidePanel current={current} started={started} loading={loading} error={error} postActionStatus={postActionStatus}
      onClose={returnToOverview} onRetry={retry} onContinue={advance} onStart={startObjective} onDefer={defer} onSubmit={(value) => engine.submit(value)} />
      : <GuideOverviewSlide onStart={start} setupLoading={loading} setupAvailable={Boolean(current)} setupError={Boolean(error)}
        deferred={deferred} onResume={resume} />}
  </main>;
}
