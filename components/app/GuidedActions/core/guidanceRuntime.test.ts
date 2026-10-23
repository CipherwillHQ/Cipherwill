// Verifies selective context reads, refresh boundaries, and private-state disposal.
// Owns deterministic runtime failure and account-refresh scenarios.
// Does not run browser automation or connect to a backend.
import test from "node:test";
import assert from "node:assert/strict";
import { GuidanceRuntime } from "./guidanceRuntime";
import { GuidanceContextCache } from "./contextCache";
import { BrowserGuidanceEngine } from "./browserEngine";
import { runtimeFlow, runtimeServices, runtimeAccount } from "./fixtures/runtime";

test("disabled, premium, completed, and unsupported flows never request their providers", async () => {
  const segment = { key: "segment_bank_account", planRequired: "free" as const, requireEnabled: true };
  const reads: string[] = [];
  const runtime = new GuidanceRuntime(runtimeServices([
    runtimeFlow("disabled", { segment, contexts: ["disabled"] }),
    runtimeFlow("premium", { segment: { ...segment, planRequired: "premium" }, contexts: ["premium"] }),
    runtimeFlow("unsupported", { contexts: ["unknown"] }),
    runtimeFlow("ineligible", { contexts: ["unused"], eligibleWhen: { path: "account.firstName", operator: "present" } }),
    runtimeFlow("completed", { contexts: ["completed"], completedWhen: { path: "account.beneficiaryCount", operator: "equals", value: 0 } }),
    runtimeFlow("ordinary"),
  ], { loadContext: async name => { reads.push(name); return {}; },
    supportsDefinition: flow => flow.id !== "unsupported" }));
  await runtime.load(); await runtime.select();
  assert.equal(runtime.flow?.id, "ordinary");
  assert.deepEqual(reads, []);
});

test("completed dependencies need no provider read even after they become ineligible", async () => {
  const runtime = new GuidanceRuntime(runtimeServices([
    runtimeFlow("dependency", { eligibleWhen: { path: "account.beneficiaryCount", operator: "gt", value: 0 },
      completedWhen: { path: "account.beneficiaryCount", operator: "equals", value: 0 }, contexts: ["unused"] }),
    runtimeFlow("dependent", { dependencies: ["dependency"] }),
  ], { loadContext: async () => { throw new Error("Should not load"); } }));
  await runtime.load(); await runtime.select();
  assert.equal(runtime.flow?.id, "dependent");
});

test("a failed dependency context cannot satisfy a missing-value completion rule", async () => {
  const runtime = new GuidanceRuntime(runtimeServices([
    runtimeFlow("dependent", { priority: 0, dependencies: ["dependency"] }),
    runtimeFlow("dependency", { contexts: ["vault"], completedWhen: { path: "context.vault.missing", operator: "missing" } }),
    runtimeFlow("ordinary"),
  ], { loadContext: async () => { throw new Error("Unavailable"); } }));
  await runtime.load(); await runtime.select();
  assert.equal(runtime.flow?.id, "ordinary");
  assert.equal(runtime.available.some(flow => flow.id === "dependent"), false);
});

test("a failed provider isolates its objectives while unrelated guidance remains available", async () => {
  let reads = 0;
  const runtime = new GuidanceRuntime(runtimeServices([
    runtimeFlow("broken", { contexts: ["vault"] }), runtimeFlow("same_provider", { contexts: ["vault"] }), runtimeFlow("ordinary"),
  ], { loadContext: async () => { reads++; throw new Error("Unavailable"); } }));
  await runtime.load(); await runtime.select();
  assert.equal(runtime.flow?.id, "ordinary");
  assert.equal(reads, 1);
  assert.deepEqual(runtime.available.map(flow => flow.id), ["ordinary"]);
});

test("a saved objective invalidates asset facts before choosing another action", async () => {
  let count = 0;
  let reads = 0;
  const guide = new BrowserGuidanceEngine(runtimeServices([
    runtimeFlow("save", { priority: 0, contexts: ["vault"], completion: { mode: "server", fields: ["confirmed"], title: "Saved", subtext: "Continue" } }),
    runtimeFlow("first_item", { contexts: ["vault"], completedWhen: { path: "context.vault.count", operator: "gt", value: 0 } }),
  ], { loadContext: async () => { reads++; return { count }; },
    completeObjective: async () => { count = 1; return { status: "complete", beneficiaryPersonId: null }; } }));
  await guide.initialize(); await guide.submit(true); await guide.continue();
  assert.equal(guide.getSnapshot().current, null);
  assert.equal(reads, 2);
});

test("refresh sees changed account facts and preserves drafts for an unchanged selected objective", async () => {
  let account = { ...runtimeAccount };
  const flow = runtimeFlow("name", { completedWhen: { path: "account.firstName", operator: "present" } });
  const runtime = new GuidanceRuntime(runtimeServices([flow], { loadAccount: async () => account }));
  await runtime.load(); await runtime.select();
  runtime.state.answers.confirmed = true;
  await runtime.refresh();
  assert.equal(runtime.state.answers.confirmed, true);
  account = { ...account, firstName: "Asha" };
  await runtime.refresh();
  assert.equal(runtime.flow, null);
  assert.deepEqual(runtime.state.answers, {});
});

test("deferred objectives load completion context before appearing in the resume list", async () => {
  const guide = new BrowserGuidanceEngine(runtimeServices([
    runtimeFlow("deferred", { contexts: ["vault"], completedWhen: { path: "context.vault.count", operator: "gt", value: 0 } }),
    runtimeFlow("ordinary"),
  ], { loadAccount: async () => ({ ...runtimeAccount, deferrals: [{ objectiveId: "deferred", dismissed: false,
    resumeAfter: String(Date.now() + 100000) }] }), loadContext: async () => ({ count: 1 }) }));
  await guide.initialize();
  assert.deepEqual(guide.getSnapshot().deferred, []);
});

test("disposal during bootstrap prevents late account retention or catalog reads", async () => {
  let resolveAccount!: (value: typeof runtimeAccount) => void;
  let catalogs = 0;
  const runtime = new GuidanceRuntime(runtimeServices([], { loadAccount: () => new Promise(resolve => { resolveAccount = resolve; }),
    loadCatalog: async () => { catalogs++; return []; } }));
  const loading = runtime.load();
  runtime.dispose(); resolveAccount({ ...runtimeAccount, firstName: "Private" });
  await assert.rejects(loading, { name: "AbortError" });
  assert.equal(runtime.account, null);
  assert.equal(catalogs, 0);
});

test("invalidating a provider prevents its old promise from repopulating the new cache", async () => {
  let resolveOld!: (value: unknown) => void;
  let reads = 0;
  const cache = new GuidanceContextCache(runtimeServices([], { loadContext: () => ++reads === 1
    ? new Promise(resolve => { resolveOld = resolve; }) : Promise.resolve({ label: "Fresh" }) }));
  const old = cache.load(["vault"]);
  await new Promise(resolve => setImmediate(resolve));
  cache.invalidate(); await cache.load(["vault"]);
  resolveOld({ label: "Private stale" });
  await assert.rejects(old, { name: "AbortError" });
  assert.deepEqual(cache.values.vault, { label: "Fresh" });
});
