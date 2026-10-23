// Loads context only for accessible unfinished candidates and their dependencies.
// Owns provider failure isolation and capability-aware objective selection.
// Does not save answers or persist catalog state.
import type { GuidanceDefinition, GuidanceScope, GuidanceServices } from "@/types/interfaces";
import { GuidanceContextCache } from "./contextCache";
import { objectiveIsAvailable, objectiveIsComplete, deferralIsActive } from "./objectiveChoices";
import { canAccessGuidanceSegment } from "./segmentEligibility";
import { matchesCondition, conditionUsesContext } from "./ruleEvaluation";

export async function selectGuidance(catalog: GuidanceDefinition[], scope: GuidanceScope, completed: Set<string>,
  contexts: GuidanceContextCache, services: GuidanceServices) {
  const supported = catalog.filter(flow => services.supportsDefinition?.(flow) !== false);
  const byId = new Map(supported.map(flow => [flow.id, flow]));
  const unavailable = new Set<string>();
  let selected: GuidanceDefinition | null = null;
  for (const flow of supported) {
    if (completed.has(flow.id) || !canAccessGuidanceSegment(flow, scope.account)) continue;
    if ((!flow.completedWhen || !conditionUsesContext(flow.completedWhen)) && objectiveIsComplete(flow, scope, completed)) continue;
    if ((scope.account.deferrals ?? []).some(item => item.objectiveId === flow.id && deferralIsActive(item, Date.now()))) continue;
    if (!await loadCandidateContext(flow, byId, scope, contexts, completed, new Set())) { unavailable.add(flow.id); continue; }
    if (objectiveIsAvailable(flow, supported, scope, completed)) { selected = flow; break; }
  }
  // Deferred items also need fresh completion facts before appearing in the resume list.
  for (const choice of scope.account.deferrals ?? []) {
    const flow = byId.get(choice.objectiveId);
    if (flow && !choice.dismissed && !completed.has(flow.id)
      && !await loadCandidateContext(flow, byId, scope, contexts, completed, new Set())) unavailable.add(flow.id);
  }
  return { selected, catalog: supported.filter(flow => !unavailable.has(flow.id) && !(flow.contexts ?? []).some(name => contexts.failed.has(name))) };
}

async function loadCandidateContext(flow: GuidanceDefinition, byId: Map<string, GuidanceDefinition>, scope: GuidanceScope,
  contexts: GuidanceContextCache, completed: Set<string>, visiting: Set<string>, dependency = false): Promise<boolean> {
  if (dependency && (!flow.completedWhen || !conditionUsesContext(flow.completedWhen)) && objectiveIsComplete(flow, scope, completed)) return true;
  if (visiting.has(flow.id)) return true;
  if (!canAccessGuidanceSegment(flow, scope.account)) return false;
  visiting.add(flow.id);
  if (!dependency && flow.eligibleWhen && !conditionUsesContext(flow.eligibleWhen) && !matchesCondition(flow.eligibleWhen, scope)) return false;
  for (const id of flow.dependencies ?? []) {
    const required = byId.get(id);
    if (!required || !await loadCandidateContext(required, byId, scope, contexts, completed, visiting, true)) return false;
  }
  await contexts.load(flow.contexts ?? []);
  return !(flow.contexts ?? []).some(name => contexts.failed.has(name));
}
