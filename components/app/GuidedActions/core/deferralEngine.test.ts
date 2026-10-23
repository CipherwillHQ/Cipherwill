// Verifies selected objective recovery and retry behavior in the browser engine.
// Owns temporary deferral, early resume, and ignored responses after disposal.
// Does not open a browser or persist real account state.
import test from "node:test";
import assert from "node:assert/strict";
import type { GuidanceDefinition, GuidanceServices } from "@/types/interfaces";
import { BrowserGuidanceEngine } from "./browserEngine";
import { firstAssetFixture } from "./fixtures/firstAsset";
import { choiceServices } from "./fixtures/choices";

const first = firstAssetFixture(0);
const second = { ...first, id: "later_note", priority: first.priority + 1 };
const deferred = { objectiveId: second.id, resumeAfter: "1900000000000", dismissed: false };

function setup(catalog: GuidanceDefinition[] = [first, second], overrides: Partial<GuidanceServices> = {}) {
  return new BrowserGuidanceEngine({ ...choiceServices, loadCatalog: async () => catalog,
    loadAccount: async () => ({ firstName: null, lastName: null, birthDate: null, beneficiaryCount: 0, deferrals: [deferred] }),
    loadContext: async () => ({ NOTE: 0 }), runOperation: async () => null,
    completeObjective: async () => { throw new Error("Choices must not save draft answers"); }, ...overrides });
}

test("early resume opens the selected objective instead of the higher-priority current one", async () => {
  const calls: string[] = [];
  const engine = setup(undefined, { resumeObjective: async id => { calls.push(id); } });
  await engine.initialize();
  assert.equal(engine.getSnapshot().current?.objectiveId, first.id);
  await engine.resume(second.id);
  assert.equal(engine.getSnapshot().current?.objectiveId, second.id);
  assert.deepEqual(engine.getSnapshot().deferred, []);
  assert.deepEqual(calls, [second.id]);
});

test("failed resume can retry even when every objective is deferred", async () => {
  let attempts = 0;
  const engine = setup([second], { resumeObjective: async () => { if (++attempts === 1) throw new Error("Offline"); } });
  await engine.initialize();
  assert.equal(engine.getSnapshot().current, null);
  await engine.resume(second.id);
  assert.match(engine.getSnapshot().error!, /update this objective/);
  assert.equal(engine.getSnapshot().deferred.length, 1);
  await engine.retry();
  assert.equal(attempts, 2);
  assert.equal(engine.getSnapshot().current?.objectiveId, second.id);
  assert.deepEqual(engine.getSnapshot().deferred, []);
});

test("Skip always defers for 90 days and leaves the objective resumable without saving drafts", async () => {
  const choices: unknown[] = [];
  const engine = setup([first], { deferObjective: async (id, dismiss) => {
    choices.push({ id, dismiss }); return choiceServices.deferObjective(id, dismiss);
  } });
  await engine.initialize();
  await engine.submit("Private draft title");
  const before = Date.now();
  await engine.defer();
  assert.deepEqual(choices, [{ id: first.id, dismiss: false }]);
  assert.equal(engine.getSnapshot().current, null);
  assert.equal(engine.getSnapshot().deferred[0].objectiveId, first.id);
  assert.ok(Number(engine.getSnapshot().deferred[0].resumeAfter) >= before + 7776000000);
  assert.doesNotMatch(JSON.stringify(engine.getSnapshot()), /Private draft title/);
});

test("starting is retained across context refresh and resets for a resumed objective", async () => {
  const engine = setup();
  await engine.initialize();
  assert.equal(engine.getSnapshot().started, false);
  engine.start();
  assert.equal(engine.getSnapshot().started, true);
  await engine.prepareContext();
  assert.equal(engine.getSnapshot().started, true);
  await engine.resume(second.id);
  assert.equal(engine.getSnapshot().started, false);
  engine.start();
  engine.dispose();
  assert.equal(engine.getSnapshot().started, false);
});

test("unavailable objectives cannot be resumed through the engine", async () => {
  let resumes = 0;
  const premium = { ...second, segment: { key: "seed", planRequired: "premium" as const, requireEnabled: false } };
  const engine = setup([premium], { resumeObjective: async () => { resumes++; } });
  await engine.initialize(); await engine.resume(premium.id);
  assert.equal(resumes, 0);
  assert.equal(engine.getSnapshot().current, null);
});

test("disposing while resuming ignores the later response and clears the recovery list", async () => {
  let finish!: () => void;
  const engine = setup([second], { resumeObjective: () => new Promise<void>(resolve => { finish = resolve; }) });
  await engine.initialize();
  const pending = engine.resume(second.id);
  engine.dispose(); finish(); await pending;
  assert.equal(engine.getSnapshot().current, null);
  assert.deepEqual(engine.getSnapshot().deferred, []);
});

test("resuming a deferred objective finishes a saved objective's remaining completion actions first", async () => {
  const calls: string[] = [];
  let attempts = 0;
  const saved: GuidanceDefinition = { ...first, steps: [{ id: "confirm", title: "Confirm", subtext: "Ready?",
    input: { key: "confirmed", type: "boolean" } }], completion: { mode: "server", fields: ["confirmed"],
    title: "Saved", subtext: "Continue", actions: [{ id: "sync", type: "sync" }] } };
  const engine = setup([saved, second], {
    completeObjective: async () => ({ status: "complete", beneficiaryPersonId: null }),
    runOperation: async type => { calls.push(type); if (++attempts === 1) throw new Error("Retry sync"); },
    resumeObjective: async () => { calls.push("resume"); },
  });
  await engine.initialize(); await engine.submit(true);
  assert.equal(engine.getSnapshot().current?.result.action, "complete");
  await engine.resume(second.id);
  assert.ok(engine.getSnapshot().error);
  assert.deepEqual(calls, ["sync"]);
  await engine.retry();
  assert.deepEqual(calls, ["sync", "sync", "resume"]);
  assert.equal(engine.getSnapshot().current?.objectiveId, second.id);
});
