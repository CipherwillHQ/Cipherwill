// Selects eligible objectives and unvisited steps from catalog definitions.
// Owns local dependency checks, branch selection, and progress calculation.
// Does not fetch context or execute step effects.
import type { GuidanceDefinition, GuidanceFlowState, GuidanceScope } from "@/types/interfaces";
import { matchesCondition } from "./ruleEvaluation";
import { deferralIsActive, objectiveIsComplete, objectiveIsAvailable } from "./objectiveChoices";

export function chooseObjective(catalog: GuidanceDefinition[], scope: GuidanceScope, completed: Set<string>, now = Date.now()) {
  const done = new Set(completed);
  const deferred = new Set((scope.account.deferrals ?? []).filter(choice => deferralIsActive(choice, now)).map(choice => choice.objectiveId));
  for (const flow of catalog) {
    if (objectiveIsComplete(flow, scope, completed)) done.add(flow.id);
  }
  return catalog.find(flow => !deferred.has(flow.id) && objectiveIsAvailable(flow, catalog, scope, done)) ?? null;
}

export function nextFlowStep(flow: GuidanceDefinition, state: GuidanceFlowState, scope: GuidanceScope) {
  return flow.steps.find(step => !state.visited.has(step.id) && matchesCondition(step.when, scope));
}

export function flowProgress(flow: GuidanceDefinition, state: GuidanceFlowState, scope: GuidanceScope) {
  const inputs = flow.steps.filter(step => step.input);
  const completed = inputs.filter(step => state.visited.has(step.id) && state.answers[step.input!.key] !== null).length;
  const skipped = inputs.filter(step => !matchesCondition(step.when, scope)
    || (state.visited.has(step.id) && state.answers[step.input!.key] === null)).length;
  return { completed, skipped, total: inputs.length };
}

export function createFlowState(): GuidanceFlowState {
  return { answers: {}, effects: {}, visited: new Set(), completion: null, finishedActions: new Set(), executedActions: new Set() };
}
