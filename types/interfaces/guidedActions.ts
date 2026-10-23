// Defines the browser guidance engine and its explicit server commands.
// Owns question, draft, account, and local asset-context contracts.
// Does not execute rules, persist conversations, or decrypt assets.
import type { GuidanceDefinition, GuidanceRecovery, GuidanceInput, GuidanceCompletion } from "./guidanceRegistry";
import type { GuidanceDeferral, DeferredGuidanceItem } from "./guidanceChoices";
export type GuidedObjectiveId = string;
export type ObjectiveState = Record<string, unknown>;
export type ObjectiveInputType = "email" | "single_line_text" | "multi_line_text" | "date" | "number" | "boolean" | "choices";
export type ObjectiveStatus = "already_complete" | "in_progress" | "complete";

export interface ObjectiveActionSpec {
  id: string;
  type: string;
  timing?: "in_action" | "post_action" | null;
  payload?: ObjectiveState | null;
}
export type ObjectiveInputSpec = GuidanceInput;
export interface ObjectiveInputPayload { step: string; value: unknown }
export interface ObjectiveProcessResult {
  status: ObjectiveStatus;
  action?: "input" | "display" | "complete" | null;
  objectiveTitle: string | null;
  objectiveDescription: string | null;
  stepsCompleted: number | null;
  stepsSkipped: number | null;
  stepsTotal: number | null;
  stepsRemaining: number | null;
  displayForMs: number | null;
  closePanelAfterDisplay: boolean | null;
  step: string | null;
  title: string | null;
  subtext: string | null;
  input: ObjectiveInputSpec | null;
  state: ObjectiveState | null;
  actions?: ObjectiveActionSpec[] | null;
  continueLabel?: string | null;
  skippable?: boolean;
}
export interface ObjectiveInProgress { objectiveId: GuidedObjectiveId; result: ObjectiveProcessResult }
export interface GuidanceAccount {
  [key: string]: unknown;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  beneficiaryCount: number;
  plan?: string;
  preferences?: Record<string, unknown>;
  completedObjectiveIds?: string[];
  deferrals?: GuidanceDeferral[];
  recovery?: GuidanceRecovery[];
}
export interface GuidancePerson { id: string; email: string; first_name?: string | null; __typename?: string }
export type GuidanceAnswers = Record<string, unknown>;
export interface GuidanceAssets { total: number; label: string | null }
export interface GuidanceServices {
  loadAccount: (refresh?: boolean) => Promise<GuidanceAccount>;
  loadCatalog: (refresh?: boolean) => Promise<GuidanceDefinition[]>;
  completeObjective: (objectiveId: GuidedObjectiveId, answers: GuidanceAnswers, version?: number) => Promise<GuidanceCompletion>;
  deferObjective: (objectiveId: GuidedObjectiveId, dismiss: boolean) => Promise<GuidanceDeferral>;
  resumeObjective: (objectiveId: GuidedObjectiveId) => Promise<void>;
  finishOperation?: (objectiveId: string, actionId: string) => Promise<void>;
  supportsDefinition?: (definition: GuidanceDefinition) => boolean;
  loadContext: (name: string, signal: AbortSignal) => Promise<unknown>;
  runOperation: (type: string, args: Record<string, unknown>, signal?: AbortSignal) => Promise<unknown>;
}
export interface GuidanceSession { publicKey: string; privateKey: string }
export interface GuidanceSnapshot {
  started: boolean;
  deferred: DeferredGuidanceItem[];
  current: ObjectiveInProgress | null;
  loading: boolean;
  error: string | null;
  postActionStatus: { title: string; subtext: string | null } | null;
}
export interface GuidancePanelProps {
  started: boolean;
  current: ObjectiveInProgress | null;
  loading: boolean;
  error: string | null;
  postActionStatus: { title: string; subtext: string | null } | null;
  onClose: () => void;
  onRetry: () => void;
  onContinue: () => void;
  onStart: () => void;
  onDefer: () => void;
  onSubmit: (value: unknown) => void;
}
export interface GuidancePanelState {
  viewState: "loading" | "error" | "empty" | "intro" | "step" | "timed";
  current: ObjectiveInProgress | null;
  contentStateKey: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  onStart: () => void;
  submitWithCurrentValue: () => void;
  skipCurrentStep: () => void;
  canSubmit: boolean;
  countdownSeconds: number;
  loadingPhrase: string;
  isTimedDisplayStep: boolean;
}
