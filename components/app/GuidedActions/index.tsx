"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { AnimatePresence } from "framer-motion";
import { useSession } from "@/contexts/SessionContext";
import GuidePanel from "./components/GuidePanel";
import GuidedButton from "./components/GuidedButton";
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
  const hasShownCurrentInOpenSessionRef = useRef(false);
  const client = useApolloClient();
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
    setShowGuidedActions(false);
    setPostActionStatus(null);
    setPendingCloseAction(shouldReload ? "reload" : "reinitialize");
  }, [showGuidedActions]);

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
    setShowGuidedActions(true);
    setPostActionStatus(null);
    clearHandledActions();
    completedObjectiveInSessionRef.current = false;
    setPendingCloseAction(null);
    await initialize({ ignorePersisted: true });
  }, [clearHandledActions, initialize]);

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
    }
  }, [showGuidedActions, current]);

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
    <div className="w-full border border-default bg-secondary p-4 rounded-lg flex items-center justify-between mb-2">
      <div className="flex flex-col gap-1">
        <span>Open Assistant</span>
        <span className="text-xs text-black/65 dark:text-white/65">
          We&apos;ve got a task you should complete.
        </span>
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
      </div>
      <GuidedButton onClick={handleOpenGuidedActions} disabled={loading}>
        Start
      </GuidedButton>
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
    </div>
  );
}
