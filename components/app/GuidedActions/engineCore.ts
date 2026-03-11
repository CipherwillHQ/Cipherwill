import type {
  ObjectiveInProgress,
  ObjectiveInputPayload,
  ObjectiveInputSpec,
  ObjectiveProcessResult,
  PersistedObjectiveSession,
} from "./types";

export interface ObjectiveEngineClient {
  getNextObjectiveId: () => Promise<string | null>;
  processObjective: (args: {
    objectiveId: string;
    state: Record<string, unknown> | null;
    input: ObjectiveInputPayload | null;
  }) => Promise<ObjectiveProcessResult>;
}

export type ObjectiveResolution =
  | { kind: "none" }
  | { kind: "in_progress"; payload: ObjectiveInProgress };

const MAX_TRANSITIONS_PER_CALL = 20;

function isTerminalStatus(status: ObjectiveProcessResult["status"]) {
  return status === "complete" || status === "already_complete";
}

export function buildSubmissionInput(
  stepKey: string,
  value: unknown
): ObjectiveInputPayload {
  return {
    step: stepKey,
    value,
  };
}

export function coerceValueForInput(
  inputSpec: ObjectiveInputSpec,
  rawValue: string
): unknown {
  if (inputSpec.type === "number") {
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : rawValue;
  }
  return rawValue;
}

export async function resolveNextInProgressObjective(
  client: ObjectiveEngineClient,
  persisted: PersistedObjectiveSession | null
): Promise<ObjectiveResolution> {
  let objectiveId: string | null = persisted?.objectiveId ?? null;
  let state: Record<string, unknown> | null = persisted?.state ?? null;

  for (let i = 0; i < MAX_TRANSITIONS_PER_CALL; i++) {
    if (!objectiveId) {
      objectiveId = await client.getNextObjectiveId();
      if (!objectiveId) {
        return { kind: "none" };
      }
      state = null;
    }

    const result = await client.processObjective({
      objectiveId,
      state,
      input: null,
    });

    if (result.status === "in_progress") {
      return {
        kind: "in_progress",
        payload: {
          objectiveId,
          result,
        },
      };
    }

    if (isTerminalStatus(result.status)) {
      objectiveId = null;
      state = null;
      continue;
    }
  }

  throw new Error("Objective engine exceeded transition safety limit.");
}

export async function advanceObjective(
  client: ObjectiveEngineClient,
  current: ObjectiveInProgress,
  input: ObjectiveInputPayload | null
): Promise<ObjectiveResolution> {
  const result = await client.processObjective({
    objectiveId: current.objectiveId,
    state: current.result.state,
    input,
  });

  if (result.status === "in_progress") {
    return {
      kind: "in_progress",
      payload: {
        objectiveId: current.objectiveId,
        result,
      },
    };
  }

  if (isTerminalStatus(result.status)) {
    return resolveNextInProgressObjective(client, null);
  }

  return { kind: "none" };
}
