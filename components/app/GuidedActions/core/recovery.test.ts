// Verifies durable follow-up recovery across reloads and catalog changes.
// Owns checkpoint retry and definition-snapshot restoration scenarios.
// Does not persist draft answers or contact real services.
import test from "node:test";
import assert from "node:assert/strict";
import type { GuidanceRecovery } from "@/types/interfaces";
import { BrowserGuidanceEngine } from "./browserEngine";
import { runtimeFlow, runtimeServices, runtimeAccount } from "./fixtures/runtime";
const saved = runtimeFlow("removed", { completion: { mode: "server", fields: ["confirmed"], title: "Saved", subtext: "Finishing",
  actions: [{ id: "done", type: "prepare" }, { id: "pending", type: "finish", args: { id: { path: "completion.data.id" } } }] } });
const recovery: GuidanceRecovery = { definition: saved, completion: { status: "complete", beneficiaryPersonId: null, data: { id: "trusted-id" } },
  pendingActionIds: ["pending"] };

test("reload restores pending actions even when the objective is removed and marked complete", async () => {
  const calls: string[] = [];
  const guide = new BrowserGuidanceEngine(runtimeServices([], {
    loadAccount: async () => ({ ...runtimeAccount, completedObjectiveIds: [saved.id], recovery: [recovery] }),
    completeObjective: async () => { throw new Error("Must not save again"); },
    runOperation: async (type, args) => { calls.push(type); assert.equal(args.id, "trusted-id"); },
    finishOperation: async (id, action) => { calls.push(action); assert.equal(id, saved.id); },
  }));
  await guide.initialize();
  assert.equal(guide.getSnapshot().current?.result.action, "complete");
  await guide.continue();
  assert.equal(guide.getSnapshot().current, null);
  assert.deepEqual(calls, ["finish", "pending"]);
});

test("acknowledgement retry does not rerun an operation already executed in this session", async () => {
  let operations = 0; let acknowledgements = 0;
  const guide = new BrowserGuidanceEngine(runtimeServices([], {
    loadAccount: async () => ({ ...runtimeAccount, recovery: [recovery] }),
    runOperation: async () => { operations++; },
    finishOperation: async () => { if (++acknowledgements === 1) throw new Error("Lost acknowledgement"); },
  }));
  await guide.initialize(); await guide.continue();
  assert.ok(guide.getSnapshot().error);
  await guide.retry();
  assert.equal(operations, 1); assert.equal(acknowledgements, 2);
  assert.equal(guide.getSnapshot().current, null);
});

test("a lost save response restores its saved definition instead of executing changed actions", async () => {
  const calls: string[] = [];
  const current = runtimeFlow(saved.id, { completion: { ...saved.completion, actions: [{ id: "changed", type: "wrong" }] } });
  const guide = new BrowserGuidanceEngine(runtimeServices([current], {
    completeObjective: async () => ({ ...recovery.completion, recovery }),
    runOperation: async type => { calls.push(type); },
  }));
  await guide.initialize(); await guide.submit(true); await guide.continue();
  assert.deepEqual(calls, ["finish"]);
});

test("removed or changed objectives reload the catalog instead of entering an endless retry", async () => {
  let catalog = [runtimeFlow("old", { version: 1, completion: { mode: "server", fields: ["confirmed"], title: "Saved", subtext: "Continue" } })];
  const guide = new BrowserGuidanceEngine(runtimeServices(catalog, {
    loadCatalog: async () => catalog,
    completeObjective: async (_id, _answers, version) => {
      assert.equal(version, 1); catalog = [runtimeFlow("new")];
      throw { errors: [{ extensions: { code: "GUIDANCE_CATALOG_CHANGED" } }] };
    },
  }));
  await guide.initialize(); await guide.submit(true);
  assert.equal(guide.getSnapshot().error, null);
  assert.equal(guide.getSnapshot().current?.objectiveId, "new");
});
