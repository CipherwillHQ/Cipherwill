// Runs registered step effects and saves the final guidance response.
// Owns retry checkpoints and cancellation checks before recording results.
// Does not select objectives or persist plaintext drafts.
import type { GuidanceDefinition, GuidanceFlowState, GuidanceScope, GuidanceServices } from "@/types/interfaces";
import { nextFlowStep } from "./flowRules";
import { matchesCondition, resolveGuidanceValues } from "./ruleEvaluation";
import { buildCompletionAnswers } from "./submission";

export async function resolveGuidanceSave(flow: GuidanceDefinition, state: GuidanceFlowState, scope: () => GuidanceScope,
  services: GuidanceServices, signal: AbortSignal, isActive: () => boolean, render: () => void) {
  let step = nextFlowStep(flow, state, scope());
  signal.throwIfAborted();
  while (step?.effect) {
    const operation = step.effect;
    render();
    if (matchesCondition(operation.when, scope())) {
      const result = await services.runOperation(operation.type, resolveGuidanceValues(operation.args, scope()), signal);
      signal.throwIfAborted();
      if (!isActive()) return;
      state.effects[operation.id] = result;
    }
    state.visited.add(step.id);
    step = nextFlowStep(flow, state, scope());
  }
  if (!step && !state.completion) {
    const result = flow.completion.mode === "local" ? { status: "complete", beneficiaryPersonId: null }
      : await services.completeObjective(flow.id, buildCompletionAnswers(flow, state.answers, scope()), flow.version);
    if (!isActive()) return;
    signal.throwIfAborted();
    state.completion = result;
    return { ...scope().account, ...resolveGuidanceValues(flow.completion.updateAccount, scope()),
      ...(result.recovery && { recovery: [...(scope().account.recovery ?? []).filter(item => item.definition.id !== flow.id), result.recovery] }) };
  }
}
