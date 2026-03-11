"use client";

import SimpleButton from "@/components/common/SimpleButton";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import GuidePanel from "./GuidePanel";
import useObjectiveEngine from "./useObjectiveEngine";

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
      <SimpleButton onClick={handleOpenGuidedActions} disabled={loading}>
        Start Now
      </SimpleButton>
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
            onSkip={continueCurrentStep}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
