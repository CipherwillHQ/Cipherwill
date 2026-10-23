// Adapts the active catalog step to the existing panel's display contract.
// Owns browser-prepared templates, progress, and completion displays.
// Does not maintain objective-specific questions or send context to the server.
import type { GuidanceDefinition, GuidanceFlowState, GuidanceScope, ObjectiveInProgress } from "@/types/interfaces";
import { nextFlowStep, flowProgress } from "./flowRules";
import { renderGuidanceText } from "./ruleEvaluation";

export function buildLocalStep(flow: GuidanceDefinition, state: GuidanceFlowState, scope: GuidanceScope): ObjectiveInProgress {
  const step = state.completion ? undefined : nextFlowStep(flow, state, scope);
  const copy = step ?? flow.completion;
  const progress = flowProgress(flow, state, scope);
  const saved = Boolean(state.completion);
  return { objectiveId: flow.id, result: {
    status: "in_progress", action: saved || !step ? "complete" : step.input ? "input" : "display",
    objectiveTitle: flow.title, objectiveDescription: renderGuidanceText(flow.description, scope),
    title: renderGuidanceText(copy.title, scope), subtext: renderGuidanceText(copy.subtext, scope),
    input: step?.input ?? null, step: step?.id ?? null,
    state: Object.fromEntries(Object.entries(state.answers).filter(([key]) => !flow.steps.some(item => item.input?.key === key && item.input.sensitive))),
    stepsCompleted: progress.completed, stepsSkipped: progress.skipped,
    stepsTotal: progress.total, stepsRemaining: Math.max(0, progress.total - progress.completed - progress.skipped),
    displayForMs: saved ? flow.completion.displayForMs ?? 0 : step?.displayForMs ?? null,
    closePanelAfterDisplay: saved, actions: null, continueLabel: step?.continueLabel ?? null, skippable: flow.skippable,
  } };
}
