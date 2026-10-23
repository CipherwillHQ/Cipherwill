// Verifies new catalog flows run without objective-specific engine changes.
// Owns synthetic branch, context, action-retry, and large-catalog scenarios.
// Does not use a browser, database, or production catalog.
import test from "node:test";
import assert from "node:assert/strict";
import type { GuidanceDefinition, GuidanceServices } from "@/types/interfaces";
import { BrowserGuidanceEngine } from "./browserEngine";
import { choiceServices } from "./fixtures/choices";

function flow(id: string, overrides: Partial<GuidanceDefinition> = {}): GuidanceDefinition {
  return { id, title: id, description: "Complete this action", priority: 1, skippable: false,
    steps: [{ id: "confirm", title: "Continue?", subtext: "Your choice", input: { key: "confirmed", type: "boolean" } }],
    completion: { mode: "local", fields: [], title: "Done", subtext: "All set" }, ...overrides };
}

function engine(catalog: GuidanceDefinition[], overrides: Partial<GuidanceServices> = {}) {
  const services: GuidanceServices = {
    loadCatalog: async () => catalog,
    ...choiceServices,
    loadAccount: async () => ({ firstName: null, lastName: null, birthDate: null, beneficiaryCount: 0 }),
    loadContext: async () => ({}), runOperation: async () => null,
    completeObjective: async () => ({ status: "complete", beneficiaryPersonId: null }), ...overrides,
  };
  return new BrowserGuidanceEngine(services);
}

test("new date/number/choice/optional questions and local branches need no engine changes", async () => {
  let saves = 0;
  const guide = engine([flow("plan_reminder", { steps: [
    { id: "date", title: "When?", subtext: "Pick a future date", input: { key: "date", type: "date" } },
    { id: "count", title: "How many?", subtext: "Choose 1 to 3", input: { key: "count", type: "number", min: 1, max: 3 } },
    { id: "channel", title: "Channel?", subtext: "Pick one", input: { key: "channel", type: "choices", choices: ["email", "sms"] } },
    { id: "note", title: "Note?", subtext: "Optional", input: { key: "note", type: "multi_line_text", skippable: true } },
    { id: "sms", when: { path: "answers.channel", operator: "equals", value: "sms" },
      title: "SMS details", subtext: "SMS selected" },
    { id: "notice", title: "Reminder: {{answers.date}}", subtext: "{{answers.count}} emails" },
  ] })], { completeObjective: async () => { saves++; return { status: "complete", beneficiaryPersonId: null }; } });
  await guide.initialize();
  await guide.submit("2099-01-01");
  await guide.submit(0);
  assert.equal(guide.getSnapshot().current?.result.step, "count");
  await guide.retry();
  await guide.submit(2);
  await guide.submit("email");
  await guide.submit(null);
  assert.equal(guide.getSnapshot().current?.result.title, "Reminder: 2099-01-01");
  assert.equal(guide.getSnapshot().current?.result.stepsSkipped, 1);
  await guide.continue();
  await guide.continue();
  assert.equal(guide.getSnapshot().current, null);
  assert.equal(saves, 0);
});

test("dependencies and shared decrypted context select from 500 objectives locally", async () => {
  let contextReads = 0;
  const catalog = Array.from({ length: 500 }, (_, i) => flow(`objective_${i}`, {
    priority: 500 - i, contexts: ["vault"],
    eligibleWhen: { path: "context.vault.total", operator: "gt", value: 0 },
    completedWhen: { path: `account.done${i}`, operator: "equals", value: true },
    dependencies: i === 499 ? ["objective_498"] : [],
  }));
  const guide = engine(catalog, { loadContext: async () => { contextReads++; return { total: 1 }; } });
  await guide.initialize();
  assert.equal(guide.getSnapshot().current?.objectiveId, "objective_498");
  await guide.submit(true);
  await guide.continue();
  assert.equal(guide.getSnapshot().current?.objectiveId, "objective_499");
  await guide.prepareContext();
  assert.equal(contextReads, 3);
});

test("completion operations retain outputs and retry only unfinished actions", async () => {
  const calls: string[] = [];
  let attempts = 0;
  const guide = engine([flow("create_custom_record", {
    completion: { mode: "server", fields: ["confirmed"], title: "Saved", subtext: "Finishing",
      actions: [
        { id: "first", type: "prepare", args: { id: { path: "completion.data.recordId" } } },
        { id: "second", type: "finish", args: { id: { path: "completion.data.recordId" } } },
      ] },
  })], {
    completeObjective: async (_id, answers) => {
      calls.push("save"); assert.deepEqual(answers, { confirmed: false });
      return { status: "complete", beneficiaryPersonId: null, data: { recordId: "record-1" } };
    },
    runOperation: async (type, args) => {
      calls.push(type);
      if (type === "prepare") { assert.equal(args.id, "record-1"); return { token: "local-token" }; }
      assert.equal(args.id, "record-1");
      if (++attempts === 1) throw new Error("Retry this action");
    },
  });
  await guide.initialize();
  await guide.submit(false);
  await guide.continue();
  assert.ok(guide.getSnapshot().error);
  await guide.retry();
  assert.equal(guide.getSnapshot().current, null);
  assert.deepEqual(calls, ["save", "prepare", "finish", "finish"]);
});

test("removed objectives and durable completions are excluded from selection", async () => {
  const guide = engine([flow("new_action"), flow("saved_action")], {
    loadAccount: async () => ({ firstName: null, lastName: null, birthDate: null, beneficiaryCount: 0,
      completedObjectiveIds: ["removed_action", "saved_action"] }),
  });
  await guide.initialize();
  assert.equal(guide.getSnapshot().current?.objectiveId, "new_action");
  await guide.submit(true);
  await guide.continue();
  assert.equal(guide.getSnapshot().current, null);
});

test("failed step effects retain answers and retry before entering the next branch", async () => {
  let attempts = 0;
  const guide = engine([flow("custom_lookup", { steps: [
    { id: "confirm", title: "Continue?", subtext: "Choose", input: { key: "confirmed", type: "boolean" } },
    { id: "lookup", title: "Looking up", subtext: "Please wait", effect: { id: "found", type: "custom_lookup" } },
    { id: "notice", when: { path: "effects.found", operator: "equals", value: true }, title: "Found", subtext: "Continue" },
  ] })], { runOperation: async () => { if (++attempts === 1) throw new Error("Unavailable"); return true; } });
  await guide.initialize();
  await guide.submit(true);
  assert.ok(guide.getSnapshot().error);
  await guide.retry();
  assert.equal(guide.getSnapshot().current?.result.title, "Found");
  assert.equal(attempts, 2);
});
