import { useEffect } from "react";
import type { ObjectiveActionSpec, ObjectiveInProgress } from "../core/types";

type PostActionStatus = {
  title: string;
  subtext: string | null;
} | null;

function toValidActions(current: ObjectiveInProgress) {
  return (current.result.actions ?? []).filter(
    (action): action is ObjectiveActionSpec => Boolean(action?.id && action?.type),
  );
}

export default function useGuidedTimedDisplay({
  showGuidedActions,
  current,
  runStepAction,
  onContinue,
  onPostActionStatusChange,
}: {
  showGuidedActions: boolean;
  current: ObjectiveInProgress | null;
  runStepAction: (stepKey: string, action: ObjectiveActionSpec) => Promise<void>;
  onContinue: () => Promise<void>;
  onPostActionStatusChange: (status: PostActionStatus) => void;
}) {
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
      const postActions = toValidActions(current).filter(
        (action) => (action.timing ?? "in_action") === "post_action",
      );

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
            onPostActionStatusChange({ title, subtext });
          }

          await runStepAction(stepKey, action);
          if (cancelled) {
            return;
          }
        }

        onPostActionStatusChange(null);
        if (!cancelled) {
          await onContinue();
        }
      };

      void runTimedStep();
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      onPostActionStatusChange(null);
    };
  }, [
    current,
    onContinue,
    onPostActionStatusChange,
    runStepAction,
    showGuidedActions,
  ]);
}
