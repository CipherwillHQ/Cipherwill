"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { AnimatePresence } from "framer-motion";
import { usePostHog } from "posthog-js/react";
import { useSession } from "@/contexts/SessionContext";
import GuidePanel from "./components/GuidePanel";
import ObjectiveLaunchCard from "./components/ObjectiveLaunchCard";
import useObjectiveEngine from "./hooks/useObjectiveEngine";
import useGuidedActionRunner from "./hooks/useGuidedActionRunner";
import useGuidedStepAutoActions from "./hooks/useGuidedStepAutoActions";
import useGuidedTimedDisplay from "./hooks/useGuidedTimedDisplay";
import useBodyOverflowLock from "./hooks/useBodyOverflowLock";

export default function GuidedActions() {
  const [showGuidedActions, setShowGuidedActions] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<
    "reload" | "reinitialize" | null
  >(null);
  const [postActionStatus, setPostActionStatus] = useState<{
    title: string;
    subtext: string | null;
  } | null>(null);
  const completedObjectiveInSessionRef = useRef(false);
  const trackedCompletedObjectiveIdsRef = useRef(new Set<string>());
  const hasShownCurrentInOpenSessionRef = useRef(false);
  const client = useApolloClient();
  const posthog = usePostHog();
  const { session } = useSession();
  const { clearHandledActions, runStepAction } = useGuidedActionRunner({
    client,
    session,
  });
  const {
    current,
    loading,
    error,
    hasObjective,
    initialize,
    reset,
    continueCurrentStep,
    submitCurrentStep,
  } = useObjectiveEngine();

  const handleCloseGuidedActions = useCallback(() => {
    if (!showGuidedActions) {
      return;
    }
    const shouldReload = completedObjectiveInSessionRef.current;
    posthog.capture("assistant_closed", {
      source: "guided_actions",
      completed_objective_in_session: shouldReload,
    });
    setShowGuidedActions(false);
    setPostActionStatus(null);
    setPendingCloseAction(shouldReload ? "reload" : "reinitialize");
  }, [posthog, showGuidedActions]);

  const handlePanelExitComplete = useCallback(async () => {
    if (!pendingCloseAction) {
      return;
    }

    clearHandledActions();
    completedObjectiveInSessionRef.current = false;
    hasShownCurrentInOpenSessionRef.current = false;
    reset();

    if (pendingCloseAction === "reload") {
      window.location.reload();
      return;
    }

    await initialize({ ignorePersisted: true });
    setPendingCloseAction(null);
  }, [clearHandledActions, initialize, pendingCloseAction, reset]);

  const handleOpenGuidedActions = useCallback(async () => {
    hasShownCurrentInOpenSessionRef.current = false;
    posthog.capture("assistant_opened", {
      source: "guided_actions",
    });
    setShowGuidedActions(true);
    setPostActionStatus(null);
    clearHandledActions();
    completedObjectiveInSessionRef.current = false;
    setPendingCloseAction(null);
    await initialize({ ignorePersisted: true });
  }, [clearHandledActions, initialize, posthog]);

  const handleContinue = useCallback(async () => {
    const shouldCloseAfterAdvance = current?.result.closePanelAfterDisplay === true;
    const resolution = await continueCurrentStep();
    if (!shouldCloseAfterAdvance || resolution?.kind !== "none") {
      return;
    }
    await handleCloseGuidedActions();
  }, [current, continueCurrentStep, handleCloseGuidedActions]);

  useEffect(() => {
    if (!showGuidedActions || !current) {
      return;
    }
    hasShownCurrentInOpenSessionRef.current = true;
    if (current.result.action === "complete") {
      completedObjectiveInSessionRef.current = true;
      if (!trackedCompletedObjectiveIdsRef.current.has(current.objectiveId)) {
        trackedCompletedObjectiveIdsRef.current.add(current.objectiveId);
        posthog.capture("objective_completed", {
          source: "guided_actions",
          objective_id: current.objectiveId,
          objective_title: current.result.objectiveTitle,
        });
      }
    }
  }, [showGuidedActions, current, posthog]);

  useGuidedTimedDisplay({
    showGuidedActions,
    current,
    runStepAction,
    onContinue: handleContinue,
    onPostActionStatusChange: setPostActionStatus,
  });

  useEffect(() => {
    if (!showGuidedActions) {
      return;
    }
    if (loading || error || current) {
      return;
    }
    if (!hasShownCurrentInOpenSessionRef.current) {
      return;
    }
    const closeTimer = window.setTimeout(() => {
      handleCloseGuidedActions();
    }, 0);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [showGuidedActions, loading, error, current, handleCloseGuidedActions]);

  useGuidedStepAutoActions({
    showGuidedActions,
    current,
    runStepAction,
  });

  useBodyOverflowLock(showGuidedActions);

  if (!hasObjective && !showGuidedActions && !pendingCloseAction) {
    return null;
  }

  return (
    <>
      {current ? (
        <ObjectiveLaunchCard
          current={current}
          loading={loading}
          error={error}
          onOpen={handleOpenGuidedActions}
        />
      ) : null}
      <AnimatePresence onExitComplete={handlePanelExitComplete}>
        {showGuidedActions && (
          <GuidePanel
            current={current}
            loading={loading}
            error={error}
            postActionStatus={postActionStatus}
            onClose={handleCloseGuidedActions}
            onRetry={initialize}
            onContinue={handleContinue}
            onSubmit={submitCurrentStep}
          />
        )}
      </AnimatePresence>
    </>
  );
}
