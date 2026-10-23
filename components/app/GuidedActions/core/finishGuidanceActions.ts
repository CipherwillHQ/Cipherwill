// Finishes registered follow-up operations after an objective has been saved.
// Owns retry checkpoints and cancellation checks for completion actions.
// Does not resave answers or choose the next objective.
import type { GuidanceDefinition, GuidanceFlowState, GuidanceScope, GuidanceServices } from "@/types/interfaces";
import { matchesCondition, resolveGuidanceValues } from "./ruleEvaluation";

export async function finishGuidanceActions(flow: GuidanceDefinition, state: GuidanceFlowState, scope: () => GuidanceScope,
  services: GuidanceServices, signal: AbortSignal, isActive: () => boolean, showStatus: () => void) {
  for (const operation of flow.completion.actions ?? []) {
    signal.throwIfAborted();
    if (state.finishedActions.has(operation.id)) continue;
    if (!state.executedActions.has(operation.id)) {
      if (matchesCondition(operation.when, scope())) {
        showStatus();
        const result = await services.runOperation(operation.type, resolveGuidanceValues(operation.args, scope()), signal);
        signal.throwIfAborted();
        if (!isActive()) return;
        state.effects[operation.id] = result;
      }
      state.executedActions.add(operation.id);
    }
    if (flow.completion.mode === "server") await services.finishOperation?.(flow.id, operation.id);
    signal.throwIfAborted();
    if (!isActive()) return;
    state.finishedActions.add(operation.id);
  }
}
