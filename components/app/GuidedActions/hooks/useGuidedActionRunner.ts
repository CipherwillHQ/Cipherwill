import { ApolloClient } from "@apollo/client";
import { useCallback, useRef } from "react";
import logger from "@/common/debug/logger";
import { executeObjectiveAction } from "../core/objectiveActionRunner";
import type { ObjectiveActionSpec } from "../core/types";

type SessionLike = {
  publicKey?: string | null;
  privateKey?: string | null;
} | null;

export default function useGuidedActionRunner({
  client,
  session,
}: {
  client: ApolloClient;
  session: SessionLike;
}) {
  const handledActionKeysRef = useRef<Set<string>>(new Set());

  const clearHandledActions = useCallback(() => {
    handledActionKeysRef.current.clear();
  }, []);

  const runStepAction = useCallback(
    async (stepKey: string, action: ObjectiveActionSpec) => {
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
    },
    [client, session],
  );

  return {
    clearHandledActions,
    runStepAction,
  };
}
