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
  const [postActionStatus, setPostActionStatus] = useState<{
    title: string;
    subtext: string | null;
  } | null>(null);
  const handledActionKeysRef = useRef<Set<string>>(new Set());
  const completedObjectiveInSessionRef = useRef(false);
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
    const shouldReload = completedObjectiveInSessionRef.current;
    setShowGuidedActions(false);
    setPostActionStatus(null);
    handledActionKeysRef.current.clear();
    completedObjectiveInSessionRef.current = false;
    reset();

    if (shouldReload) {
      window.location.reload();
      return;
    }

    await initialize({ ignorePersisted: true });
  }, [initialize, reset]);

  const handleOpenGuidedActions = useCallback(async () => {
    setShowGuidedActions(true);
    setPostActionStatus(null);
    handledActionKeysRef.current.clear();
    completedObjectiveInSessionRef.current = false;
    await initialize({ ignorePersisted: true });
  }, [initialize]);

  useEffect(() => {
    if (!showGuidedActions || !current) {
      return;
    }
    if (current.result.action === "complete") {
      completedObjectiveInSessionRef.current = true;
    }
  }, [showGuidedActions, current]);

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

    let cancelled = false;

    const timer = window.setTimeout(() => {
      const stepKey = `${current.objectiveId}:${current.result.step ?? current.result.title ?? "step"}`;
      const allActions = (current.result.actions ?? []).filter(
        (action): action is ObjectiveActionSpec =>
          Boolean(action?.id && action?.type),
      );
      const postActions = allActions.filter(
        (action) => (action.timing ?? "in_action") === "post_action",
      );

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

      const runTimedStep = async () => {
        for (const action of postActions) {
          const payload = action.payload ?? {};
          const isBlocking = payload.blocking === true;
          if (isBlocking) {
            const title =
              typeof payload.pendingTitle === "string"
                ? payload.pendingTitle
                : "Processing action...";
            const subtext =
              typeof payload.pendingSubtext === "string"
                ? payload.pendingSubtext
                : null;
            setPostActionStatus({ title, subtext });
          }

          await runAction(action);
          if (cancelled) {
            return;
          }
        }

        setPostActionStatus(null);
        if (!cancelled) {
          await continueCurrentStep();
        }
      };

      void runTimedStep();
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      setPostActionStatus(null);
    };
  }, [client, current, session, showGuidedActions, continueCurrentStep]);

  useEffect(() => {
    if (!showGuidedActions) {
      return;
    }
    if (loading || error || current) {
      return;
    }

    void handleCloseGuidedActions();
  }, [showGuidedActions, loading, error, current, handleCloseGuidedActions]);

  useEffect(() => {
    if (!showGuidedActions || !current) {
      return;
    }

    const isTimedDisplayStep =
      !current.result.input &&
      typeof current.result.displayForMs === "number" &&
      current.result.displayForMs > 0;
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
    if (isTimedDisplayStep) {
      return;
    }

    const nonTimedPostActions = actions.filter(
      (action) => (action.timing ?? "in_action") === "post_action",
    );
    for (const action of nonTimedPostActions) {
      void runAction(action);
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
            postActionStatus={postActionStatus}
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
