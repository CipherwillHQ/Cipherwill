// Verifies local question transitions and the explicit network boundary.
// Owns fake services for save, lookup, migration, and session cleanup tests.
// Does not access a real account, browser, or database.
import test from "node:test";
import assert from "node:assert/strict";
import type { GuidanceAccount, GuidanceServices } from "@/types/interfaces";
import { BrowserGuidanceEngine } from "./browserEngine";
import { choiceServices } from "./fixtures/choices";
import { testCatalog } from "./fixtures/catalog";

const readyAccount: GuidanceAccount = { firstName: "Shivam", lastName: "Shah", birthDate: "2000-01-01", beneficiaryCount: 0 };

function setup(account = readyAccount, overrides: Partial<GuidanceServices> = {}) {
  const calls: Array<{ type: string; payload?: unknown }> = [];
  const services: GuidanceServices = {
    loadAccount: async () => { calls.push({ type: "account" }); return account; },
    loadCatalog: async () => testCatalog,
    ...choiceServices,
    completeObjective: async (objectiveId, answers) => {
      calls.push({ type: "save", payload: { objectiveId, answers } });
      return { status: "complete", beneficiaryPersonId: objectiveId === "add_beneficiary" ? "person-1" : null };
    },
    loadContext: async () => ({ total: 2, label: "your Example bank account" }),
    runOperation: async (type) => { calls.push({ type: type === "lookup_person" ? "lookup" : "migration" }); return null; },
    ...overrides,
  };
  return { engine: new BrowserGuidanceEngine(services), calls };
}

test("profile objectives are chosen locally and each field has one final save", async () => {
  const { engine, calls } = setup({ ...readyAccount, firstName: null, lastName: null, birthDate: null });
  await engine.initialize();
  assert.equal(engine.getSnapshot().current?.objectiveId, "add_first_name");
  await engine.submit(" Sita ");
  assert.equal(engine.getSnapshot().current?.result.action, "complete");
  await engine.continue();
  assert.equal(engine.getSnapshot().current?.objectiveId, "add_last_name");
  await engine.submit("Shah");
  await engine.continue();
  await engine.submit("2000-01-01");
  await engine.continue();
  assert.equal(engine.getSnapshot().current?.objectiveId, "add_beneficiary");
  assert.deepEqual(calls.map(call => call.type), ["account", "save", "save", "save"]);
});

test("guest invitation branching and display continuation stay local until the final answer", async () => {
  const { engine, calls } = setup();
  await engine.initialize();
  await engine.prepareContext();
  assert.match(engine.getSnapshot().current!.result.subtext!, /Example bank account/);
  await engine.submit(" Guest@Example.com ");
  await engine.continue();
  await engine.submit("Guest");
  assert.equal(engine.getSnapshot().current?.result.step, "sendInvite");
  assert.deepEqual(calls.map(call => call.type), ["account", "account", "lookup"]);
  await engine.submit(true);
  assert.equal(engine.getSnapshot().current?.result.step, "anonymousInvite");
  assert.equal(calls.length, 3);
  await engine.submit(false);
  const command = calls.find(call => call.type === "save")!.payload;
  assert.deepEqual(command, { objectiveId: "add_beneficiary", answers: {
    email: "guest@example.com", firstName: "Guest", sendInvite: true, anonymousInvite: false,
  } });
  assert.doesNotMatch(JSON.stringify(command), /Example bank|existingUser|lookupAcknowledged/);
  await engine.continue();
  assert.equal(engine.getSnapshot().current, null);
  assert.deepEqual(calls.map(call => call.type), ["account", "account", "lookup", "save", "migration"]);
});

test("declining an invitation skips anonymity without losing the false answer", async () => {
  const { engine, calls } = setup();
  await engine.initialize();
  await engine.submit("guest@example.com");
  await engine.continue();
  await engine.submit("Guest");
  await engine.submit(false);
  assert.equal(engine.getSnapshot().current?.result.stepsSkipped, 1);
  assert.equal(engine.getSnapshot().current?.result.action, "complete");
  assert.match(JSON.stringify(calls.at(-1)?.payload), /"sendInvite":false/);
});

test("existing account bypasses guest questions after one lookup", async () => {
  const { engine, calls } = setup(readyAccount, {
    runOperation: async () => ({ id: "person-1", email: "existing@example.com", __typename: "User" }),
  });
  await engine.initialize();
  await engine.submit("existing@example.com");
  assert.equal(engine.getSnapshot().current?.result.stepsSkipped, 3);
  assert.equal(engine.getSnapshot().current?.result.action, "complete");
  assert.equal(calls.filter(call => call.type === "save").length, 1);
});

test("invalid answers never reach a network service", async () => {
  const { engine, calls } = setup();
  await engine.initialize();
  await engine.submit("invalid");
  assert.equal(engine.getSnapshot().current?.result.step, "email");
  assert.deepEqual(calls.map(call => call.type), ["account"]);
  await engine.retry();
  assert.equal(engine.getSnapshot().error, null);
  assert.deepEqual(calls.map(call => call.type), ["account"]);
});

test("failed migration retries without repeating the final save or invitation", async () => {
  let migrations = 0;
  const { engine, calls } = setup(readyAccount, {
    runOperation: async (type) => {
      if (type === "lookup_person") return { id: "person-1", email: "existing@example.com" };
      if (++migrations === 1) throw new Error("failed");
    },
  });
  await engine.initialize();
  await engine.submit("existing@example.com");
  await engine.continue();
  assert.match(engine.getSnapshot().error!, /completion action/);
  assert.equal(engine.getSnapshot().current?.result.action, "complete");
  await engine.retry();
  assert.equal(engine.getSnapshot().current, null);
  assert.equal(migrations, 2);
  assert.equal(calls.filter(call => call.type === "save").length, 1);
});

test("a save failure retains validated answers for retry", async () => {
  let saves = 0;
  const { engine } = setup({ ...readyAccount, firstName: null }, {
    completeObjective: async (_id, answers) => {
      assert.equal(answers.firstName, "Sita");
      if (++saves === 1) throw new Error("offline");
      return { status: "complete", beneficiaryPersonId: null };
    },
  });
  await engine.initialize();
  await engine.submit("Sita");
  assert.ok(engine.getSnapshot().error);
  await engine.retry();
  assert.equal(engine.getSnapshot().current?.result.action, "complete");
  assert.equal(saves, 2);
});

test("session disposal clears draft and ignores an outstanding asset response", async () => {
  let resolveAssets!: (assets: { total: number; label: string }) => void;
  const { engine } = setup(readyAccount, { loadContext: () => new Promise(resolve => { resolveAssets = resolve; }) });
  const pending = engine.initialize();
  await new Promise(resolve => setImmediate(resolve));
  engine.dispose();
  resolveAssets({ total: 1, label: "Private label" });
  await pending;
  assert.equal(engine.getSnapshot().current, null);
  assert.doesNotMatch(JSON.stringify(engine.getSnapshot()), /Private label/);
});

test("session disposal ignores a save response that arrives after locking", async () => {
  let resolveSave!: (value: { status: string; beneficiaryPersonId: null }) => void;
  const { engine } = setup({ ...readyAccount, firstName: null }, {
    completeObjective: () => new Promise(resolve => { resolveSave = resolve; }),
  });
  await engine.initialize();
  const pending = engine.submit("Private Name");
  engine.dispose();
  resolveSave({ status: "complete", beneficiaryPersonId: null });
  await pending;
  assert.equal(engine.getSnapshot().current, null);
  assert.doesNotMatch(JSON.stringify(engine.getSnapshot()), /Private Name/);
});
