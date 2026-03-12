"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { AnimatePresence } from "framer-motion";
import logger from "@/common/debug/logger";
import { useSession } from "@/contexts/SessionContext";
import GuidePanel from "./components/GuidePanel";
import GuidedButton from "./components/GuidedButton";
import { executeObjectiveAction } from "./core/objectiveActionRunner";
import type { ObjectiveActionSpec } from "./core/types";
import useObjectiveEngine from "./hooks/useObjectiveEngine";

export default function GuidedActions() {
  const [showGuidedActions, setShowGuidedActions] = useState(false);
  const handledActionKeysRef = useRef<Set<string>>(new Set());
  const client = useApolloClient();
  const { session } = useSession();
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
    handledActionKeysRef.current.clear();
    reset();
    await initialize({ ignorePersisted: true });
  }, [initialize, reset]);

  const handleOpenGuidedActions = useCallback(async () => {
    setShowGuidedActions(true);
    handledActionKeysRef.current.clear();
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
    if (!showGuidedActions || !current) {
      return;
    }

    const stepKey = `${current.objectiveId}:${current.result.step ?? current.result.title ?? "step"}`;
    const actions = (current.result.actions ?? []).filter(
      (action): action is ObjectiveActionSpec => Boolean(action?.id && action?.type),
    );
    if (actions.length === 0) {
      return;
    }

    const runAction = async (action: ObjectiveActionSpec) => {
      const actionKey = `${stepKey}:${action.id}:${action.timing ?? "in_action"}`;
      if (handledActionKeysRef.current.has(actionKey)) {
        return;
      }
      handledActionKeysRef.current.add(actionKey);
      try {
        await executeObjectiveAction(action, { client, session });
      } catch (actionError) {
        logger.error(`Guided action handler failed: ${action.type}`, actionError);
      }
    };

    const immediateActions = actions.filter(
      (action) => (action.timing ?? "in_action") === "in_action",
    );
    for (const action of immediateActions) {
      void runAction(action);
    }

    const postActions = actions.filter(
      (action) => (action.timing ?? "in_action") === "post_action",
    );
    if (postActions.length > 0) {
      const delay =
        typeof current.result.displayForMs === "number" && current.result.displayForMs > 0
          ? current.result.displayForMs
          : 0;
      const timer = window.setTimeout(() => {
        for (const action of postActions) {
          void runAction(action);
        }
      }, delay);
      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [client, current, session, showGuidedActions]);

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
