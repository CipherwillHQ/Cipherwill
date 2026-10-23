// Verifies segment opt-in, premium eligibility, and recoverable objective deferral.
// Owns generic browser selection and retry tests with isolated account services.
// Does not enable real segments or send private answers to a server.
import test from "node:test";
import assert from "node:assert/strict";
import type { GuidanceAccount, GuidanceDefinition, GuidanceDeferral, GuidanceServices } from "@/types/interfaces";
import { BrowserGuidanceEngine } from "./browserEngine";
import { choiceServices } from "./fixtures/choices";

const account: GuidanceAccount = { firstName: null, lastName: null, birthDate: null, beneficiaryCount: 0,
  plan: "free", preferences: { segment_bank_account: false }, deferrals: [] };
const enable: GuidanceDefinition = {
  id: "enable_bank", title: "Bank accounts", description: "Store bank details?", priority: 2, skippable: true,
  segment: { key: "segment_bank_account", planRequired: "free", requireEnabled: false },
  completedWhen: { path: "account.preferences.segment_bank_account", operator: "equals", value: true },
  skipWhen: { path: "answers.enabled", operator: "equals", value: false },
  steps: [{ id: "enable", title: "Store bank details?", subtext: "Your choice", input: { key: "enabled", type: "boolean" } }],
  completion: { mode: "server", fields: ["enabled"], title: "Enabled", subtext: "Continue",
    updateAccount: { preferences: { path: "completion.data.preferences" } } },
};
const add: GuidanceDefinition = { ...enable, id: "add_bank", priority: 1, skipWhen: undefined, completedWhen: undefined,
  segment: { ...enable.segment!, requireEnabled: true },
  steps: [{ id: "name", title: "Bank name?", subtext: "Enter name", input: { key: "name", type: "single_line_text" } }],
  completion: { mode: "local", fields: [], title: "Added", subtext: "Continue" },
};

function setup(catalog = [add, enable], overrides: Partial<GuidanceServices> = {}) {
  const deferrals: GuidanceDeferral[] = [];
  const saves: Array<{ id: string; answers: unknown }> = [];
  const engine = new BrowserGuidanceEngine({
    loadAccount: async () => account, loadCatalog: async () => catalog, loadContext: async () => ({}),
    runOperation: async () => null, ...choiceServices,
    deferObjective: async (id, dismiss) => {
      const choice = await choiceServices.deferObjective(id, dismiss);
      deferrals.push(choice); return choice;
    },
    completeObjective: async (id, answers) => {
      saves.push({ id, answers });
      return { status: "complete", beneficiaryPersonId: null, data: { preferences: { segment_bank_account: true } } };
    }, ...overrides,
  });
  return { engine, deferrals, saves };
}

test("disabled segments show opt-in first; Yes unlocks their data objective in the same session", async () => {
  const { engine, saves } = setup();
  await engine.initialize();
  assert.equal(engine.getSnapshot().current?.objectiveId, "enable_bank");
  await engine.submit(true);
  assert.deepEqual(saves, [{ id: "enable_bank", answers: { enabled: true } }]);
  await engine.continue();
  assert.equal(engine.getSnapshot().current?.objectiveId, "add_bank");
  const next = setup(undefined, { loadAccount: async () => ({ ...account, preferences: { segment_bank_account: true } }) }).engine;
  await next.initialize();
  assert.equal(next.getSnapshot().current?.objectiveId, "add_bank");
});

test("No defers the opt-in without enabling or completing it, including after reload", async () => {
  const { engine, deferrals, saves } = setup();
  await engine.initialize(); await engine.submit(false);
  assert.equal(deferrals[0].objectiveId, "enable_bank");
  assert.equal(deferrals[0].dismissed, false);
  assert.deepEqual(saves, []);
  assert.equal(engine.getSnapshot().current, null);
  const next = setup(undefined, { loadAccount: async () => ({ ...account, deferrals }) }).engine;
  await next.initialize();
  assert.equal(next.getSnapshot().current, null);
});

test("premium prompts and data objectives stay hidden for free accounts even with enabled preferences", async () => {
  const premium = [enable, add].map(flow => ({ ...flow, segment: { ...flow.segment!, planRequired: "premium" as const } }));
  for (const enabled of [false, true]) {
    const { engine } = setup(premium, { loadAccount: async () => ({ ...account, preferences: { segment_bank_account: enabled } }) });
    await engine.initialize();
    assert.equal(engine.getSnapshot().current, null);
  }
  const { engine } = setup(premium, { loadAccount: async () => ({ ...account, plan: "premium" }) });
  await engine.initialize();
  assert.equal(engine.getSnapshot().current?.objectiveId, "enable_bank");
});

test("deferrals discard drafts, advance to the next objective, and do not satisfy completion dependencies", async () => {
  const dependency = { ...add, id: "dependent", dependencies: ["add_bank"], segment: undefined };
  const next = { ...add, id: "next", priority: 3, segment: undefined };
  const draftFlow = { ...add, steps: [...add.steps, { ...add.steps[0], id: "extra",
    input: { key: "extra", type: "single_line_text" as const } }] };
  const { engine, deferrals, saves } = setup([draftFlow, dependency, next], {
    loadAccount: async () => ({ ...account, preferences: { segment_bank_account: true } }),
  });
  await engine.initialize(); await engine.submit("Private bank name"); await engine.defer();
  assert.equal(deferrals[0].objectiveId, "add_bank");
  assert.deepEqual(saves, []);
  assert.equal(engine.getSnapshot().current?.objectiveId, "next");
  assert.deepEqual(engine.getSnapshot().current?.result.state, {});
  assert.doesNotMatch(JSON.stringify(engine.getSnapshot()), /Private bank name/);
});

test("failed deferrals retry the choice without saving answers", async () => {
  let attempts = 0;
  const { engine, saves } = setup([enable], { deferObjective: async (id, dismiss) => {
    if (++attempts === 1) throw new Error("Offline"); return choiceServices.deferObjective(id, dismiss);
  } });
  await engine.initialize(); await engine.submit(false);
  assert.match(engine.getSnapshot().error!, /update this objective/);
  assert.equal(engine.getSnapshot().current?.objectiveId, "enable_bank");
  await engine.retry();
  assert.equal(attempts, 2);
  assert.equal(engine.getSnapshot().current, null);
  assert.deepEqual(saves, []);
});

test("busy choices and session disposal prevent stale deferral transitions", async () => {
  let finish!: (value: GuidanceDeferral) => void;
  const { engine, deferrals } = setup([enable], { deferObjective: () => new Promise<GuidanceDeferral>(resolve => { finish = resolve; }) });
  await engine.initialize();
  const pending = engine.defer();
  await engine.defer();
  assert.equal(engine.getSnapshot().loading, true);
  engine.dispose(); finish({ objectiveId: enable.id, dismissed: false, resumeAfter: "1900000000000" }); await pending;
  assert.equal(engine.getSnapshot().current, null);
  assert.deepEqual(deferrals, []);
  assert.deepEqual(engine.getSnapshot().deferred, []);
});

test("enabling a segment restores temporarily deferred data guidance and respects explicit dismissals", async () => {
  for (const dismissed of [false, true]) {
    const choice = await choiceServices.deferObjective(add.id, dismissed);
    const { engine } = setup(undefined, { loadAccount: async () => ({ ...account, deferrals: [choice] }) });
    await engine.initialize();
    assert.equal(engine.getSnapshot().current?.objectiveId, enable.id);
    await engine.submit(true); await engine.continue();
    assert.equal(engine.getSnapshot().current?.objectiveId ?? null, dismissed ? null : add.id);
    assert.deepEqual(engine.getSnapshot().deferred, []);
  }
});
