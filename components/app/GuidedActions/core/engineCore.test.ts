import test from "node:test";
import assert from "node:assert/strict";
import {
  advanceObjective,
  buildSubmissionInput,
  coerceValueForInput,
  resolveNextInProgressObjective,
  type ObjectiveEngineClient,
} from "./engineCore";
import type { ObjectiveProcessResult } from "./types";

function createClient({
  objectiveIds,
  processResults,
}: {
  objectiveIds: Array<string | null>;
  processResults: ObjectiveProcessResult[];
}): ObjectiveEngineClient & { calls: Array<unknown> } {
  const idsQueue = [...objectiveIds];
  const processQueue = [...processResults];
  const calls: Array<unknown> = [];

  return {
    calls,
    getNextObjectiveId: async () => idsQueue.shift() ?? null,
    processObjective: async ({ objectiveId, state, input }) => {
      calls.push({ objectiveId, state, input });
      const result = processQueue.shift();
      if (!result) {
        throw new Error("Unexpected processObjective call in test");
      }
      return result;
    },
  };
}

test("happy path: in-progress then complete", async () => {
  const client = createClient({
    objectiveIds: ["objective-a", null],
    processResults: [
      {
        status: "in_progress",
        objectiveTitle: "Add a beneficiary",
        objectiveDescription: "Add your first beneficiary to get started.",
        stepsCompleted: 0,
        stepsSkipped: 0,
        stepsTotal: 4,
        stepsRemaining: 4,
        displayForMs: null,
        closePanelAfterDisplay: null,
        step: "name",
        title: "What is your name?",
        subtext: "This helps personalize your vault.",
        input: { type: "single_line_text", key: "name" },
        state: { started: true },
      },
      {
        status: "complete",
        objectiveTitle: null,
        objectiveDescription: null,
        stepsCompleted: null,
        stepsSkipped: null,
        stepsTotal: null,
        stepsRemaining: null,
        displayForMs: null,
        closePanelAfterDisplay: null,
        step: null,
        title: null,
        subtext: null,
        input: null,
        state: { started: true, done: true },
      },
    ],
  });

  const initial = await resolveNextInProgressObjective(client, null);
  assert.equal(initial.kind, "in_progress");
  if (initial.kind !== "in_progress") {
    return;
  }

  const advanced = await advanceObjective(
    client,
    initial.payload,
    buildSubmissionInput("name", "Shivam")
  );
  assert.equal(advanced.kind, "none");
});

test("already-complete objective is skipped automatically", async () => {
  const client = createClient({
    objectiveIds: ["objective-a", "objective-b"],
    processResults: [
      {
        status: "already_complete",
        objectiveTitle: null,
        objectiveDescription: null,
        stepsCompleted: null,
        stepsSkipped: null,
        stepsTotal: null,
        stepsRemaining: null,
        displayForMs: null,
        closePanelAfterDisplay: null,
        step: null,
        title: null,
        subtext: null,
        input: null,
        state: null,
      },
      {
        status: "in_progress",
        objectiveTitle: "Enable updates",
        objectiveDescription: "Set communication preferences.",
        stepsCompleted: 1,
        stepsSkipped: 0,
        stepsTotal: 2,
        stepsRemaining: 1,
        displayForMs: null,
        closePanelAfterDisplay: null,
        step: "confirm_opt_in",
        title: "Enable updates?",
        subtext: "This can be changed later.",
        input: { type: "boolean", key: "confirm_opt_in", skippable: false },
        state: { resumed: true },
      },
    ],
  });

  const resolution = await resolveNextInProgressObjective(client, null);
  assert.equal(resolution.kind, "in_progress");
  if (resolution.kind !== "in_progress") {
    return;
  }
  assert.equal(resolution.payload.objectiveId, "objective-b");
});

test("boolean and text values are preserved/coerced correctly", () => {
  const textInput = coerceValueForInput(
    { type: "single_line_text", key: "bio" },
    "hello"
  );
  const boolInput = buildSubmissionInput("allow_marketing", true);
  assert.equal(textInput, "hello");
  assert.deepEqual(boolInput, { step: "allow_marketing", value: true });
});

test("resume uses persisted objective and state", async () => {
  const client = createClient({
    objectiveIds: ["objective-fallback"],
    processResults: [
      {
        status: "in_progress",
        objectiveTitle: "Add a beneficiary",
        objectiveDescription: "Add your first beneficiary to get started.",
        stepsCompleted: 1,
        stepsSkipped: 0,
        stepsTotal: 4,
        stepsRemaining: 3,
        displayForMs: null,
        closePanelAfterDisplay: null,
        step: "email",
        title: "Email",
        subtext: "Enter your email",
        input: { type: "email", key: "email" },
        state: { draftEmail: "user@example.com" },
      },
    ],
  });

  const resolution = await resolveNextInProgressObjective(client, {
    objectiveId: "objective-persisted",
    state: { draftEmail: "old@example.com" },
  });

  assert.equal(resolution.kind, "in_progress");
  assert.equal(client.calls.length, 1);
  assert.deepEqual(client.calls[0], {
    objectiveId: "objective-persisted",
    state: { draftEmail: "old@example.com" },
    input: null,
  });
});
