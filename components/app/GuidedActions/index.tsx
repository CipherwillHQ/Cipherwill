"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import GuidePanel from "./components/GuidePanel";
import GuidedButton from "./components/GuidedButton";
import useObjectiveEngine from "./hooks/useObjectiveEngine";

export default function GuidedActions() {
  const [showGuidedActions, setShowGuidedActions] = useState(false);
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

  const handleCloseGuidedActions = useCallback(async () => {
    setShowGuidedActions(false);
    reset();
    await initialize({ ignorePersisted: true });
  }, [initialize, reset]);

  const handleOpenGuidedActions = useCallback(async () => {
    setShowGuidedActions(true);
    await initialize({ ignorePersisted: true });
  }, [initialize]);

  useEffect(() => {
    if (!showGuidedActions || !current) {
      return;
    }
    if (current.result.input) {
      return;
    }
    const delay =
      typeof current.result.displayForMs === "number"
        ? current.result.displayForMs
        : 0;
    if (delay <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (current.result.closePanelAfterDisplay) {
        void handleCloseGuidedActions();
        return;
      }
      void continueCurrentStep();
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [current, showGuidedActions, continueCurrentStep, handleCloseGuidedActions]);

  useEffect(() => {
    if (showGuidedActions) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showGuidedActions]);

  if (!hasObjective && !loading && !error) {
    return null;
  }

  return (
    <div className="w-full border border-default bg-secondary p-4 rounded-lg flex items-center justify-between mb-2">
      <div className="flex flex-col gap-1">
        <span>Start guided actions</span>
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
      </div>
      <GuidedButton onClick={handleOpenGuidedActions} disabled={loading}>
        Start Now
      </GuidedButton>
      <AnimatePresence>
        {showGuidedActions && (
          <GuidePanel
            current={current}
            loading={loading}
            error={error}
            onClose={handleCloseGuidedActions}
            onRetry={initialize}
            onContinue={continueCurrentStep}
            onSubmit={submitCurrentStep}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
