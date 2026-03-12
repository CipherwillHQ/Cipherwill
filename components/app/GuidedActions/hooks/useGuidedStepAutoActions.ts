import { useEffect } from "react";
import type { ObjectiveActionSpec, ObjectiveInProgress } from "../core/types";

function toValidActions(current: ObjectiveInProgress) {
  return (current.result.actions ?? []).filter(
    (action): action is ObjectiveActionSpec => Boolean(action?.id && action?.type),
  );
}

export default function useGuidedStepAutoActions({
  showGuidedActions,
  current,
  runStepAction,
}: {
  showGuidedActions: boolean;
  current: ObjectiveInProgress | null;
  runStepAction: (stepKey: string, action: ObjectiveActionSpec) => Promise<void>;
}) {
  useEffect(() => {
    if (!showGuidedActions || !current) {
      return;
    }

    const isTimedDisplayStep =
      !current.result.input &&
      typeof current.result.displayForMs === "number" &&
      current.result.displayForMs > 0;
    const stepKey = `${current.objectiveId}:${current.result.step ?? current.result.title ?? "step"}`;
    const actions = toValidActions(current);
    if (actions.length === 0) {
      return;
    }

    const immediateActions = actions.filter(
      (action) => (action.timing ?? "in_action") === "in_action",
    );
    for (const action of immediateActions) {
      void runStepAction(stepKey, action);
    }

    if (isTimedDisplayStep) {
      return;
    }

    const nonTimedPostActions = actions.filter(
      (action) => (action.timing ?? "in_action") === "post_action",
    );
    for (const action of nonTimedPostActions) {
      void runStepAction(stepKey, action);
    }
  }, [current, runStepAction, showGuidedActions]);
}
