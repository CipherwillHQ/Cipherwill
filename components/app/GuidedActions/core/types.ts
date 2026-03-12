export type ObjectiveStatus = "already_complete" | "in_progress" | "complete";

export type ObjectiveInputType =
  | "email"
  | "single_line_text"
  | "multi_line_text"
  | "date"
  | "number"
  | "boolean"
  | "choices";

export type ObjectiveState = Record<string, unknown>;

export interface ObjectiveActionSpec {
  id: string;
  type: string;
  timing?: "in_action" | "post_action" | null;
  payload?: ObjectiveState | null;
}

export interface ObjectiveInputSpec {
  type: ObjectiveInputType;
  key: string;
  placeholder?: string | null;
  minLength?: number | null;
  maxLength?: number | null;
  min?: number | null;
  max?: number | null;
  choices?: unknown[] | null;
  skippable?: boolean | null;
}

export interface ObjectiveInputPayload {
  step: string;
  value: unknown;
}

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
}

export interface PersistedObjectiveSession {
  objectiveId: string;
  state: ObjectiveState | null;
}

export interface ObjectiveInProgress {
  objectiveId: string;
  result: ObjectiveProcessResult;
}
