export type ObjectiveStatus = "already_complete" | "in_progress" | "complete";

export type ObjectiveInputType =
  | "single_line_text"
  | "multi_line_text"
  | "number"
  | "boolean"
  | "choices";

export type ObjectiveState = Record<string, unknown>;

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
  objectiveTitle: string | null;
  objectiveDescription: string | null;
  stepsCompleted: number | null;
  stepsTotal: number | null;
  stepsRemaining: number | null;
  step: string | null;
  title: string | null;
  subtext: string | null;
  input: ObjectiveInputSpec | null;
  state: ObjectiveState | null;
}

export interface PersistedObjectiveSession {
  objectiveId: string;
  state: ObjectiveState | null;
}

export interface ObjectiveInProgress {
  objectiveId: string;
  result: ObjectiveProcessResult;
}
