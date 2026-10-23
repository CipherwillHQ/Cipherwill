// Applies time-based deferrals and builds recoverable objective lists locally.
// Owns choice filtering and completed/dependency checks for resume selection.
// Does not persist choices or enable segments.
import type { GuidanceAccount, GuidanceDefinition, GuidanceScope, GuidanceDeferral } from "@/types/interfaces";
import { matchesCondition } from "./ruleEvaluation";
import { canAccessGuidanceSegment } from "./segmentEligibility";

export function objectiveIsComplete(flow: GuidanceDefinition, scope: GuidanceScope, completed: Set<string>) {
  return completed.has(flow.id) || (flow.completedWhen ? matchesCondition(flow.completedWhen, scope)
    : (scope.account.completedObjectiveIds ?? []).includes(flow.id));
}

export function objectiveIsAvailable(flow: GuidanceDefinition, catalog: GuidanceDefinition[], scope: GuidanceScope, completed: Set<string>) {
  return !objectiveIsComplete(flow, scope, completed) && canAccessGuidanceSegment(flow, scope.account)
    && matchesCondition(flow.eligibleWhen, scope)
    && (flow.dependencies ?? []).every(id => {
      const dependency = catalog.find(item => item.id === id);
      return Boolean(dependency && objectiveIsComplete(dependency, scope, completed));
    });
}

export function deferralIsActive(choice: GuidanceDeferral, now: number) {
  return choice.dismissed || (choice.resumeAfter !== null && Number(choice.resumeAfter) > now);
}

export function deferredGuidanceItems(catalog: GuidanceDefinition[], scope: GuidanceScope, completed: Set<string>) {
  return (scope.account.deferrals ?? []).flatMap(choice => {
    const flow = catalog.find(item => item.id === choice.objectiveId);
    return !choice.dismissed && flow && objectiveIsAvailable(flow, catalog, scope, completed)
      ? [{ objectiveId: flow.id, title: flow.title, resumeAfter: choice.resumeAfter }] : [];
  });
}

export function restoreEnabledSegmentGuidance(previous: GuidanceAccount, next: GuidanceAccount, catalog: GuidanceDefinition[]) {
  const restored = new Set(catalog.filter(flow => flow.segment && previous.preferences?.[flow.segment.key] !== true
    && next.preferences?.[flow.segment.key] === true).map(flow => flow.id));
  return { ...next, deferrals: (next.deferrals ?? []).filter(choice => choice.dismissed || !restored.has(choice.objectiveId)) };
}
