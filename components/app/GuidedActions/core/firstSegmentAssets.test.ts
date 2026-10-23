// Verifies section first-item guidance transitions and private file selections.
// Owns enable-to-save sequencing, plan/count eligibility, and identifier-only commands.
// Does not open a browser or encrypt real files.
import test from "node:test";
import assert from "node:assert/strict";
import type { GuidanceAccount, GuidanceDefinition, GuidanceServices } from "@/types/interfaces";
import { BrowserGuidanceEngine } from "./browserEngine";
import { choiceServices } from "./fixtures/choices";
import { firstFileFixture, firstSegmentAssetFixture, segmentAssetCases } from "./fixtures/firstSegmentAssets";
import { supportsGuidanceDefinition } from "./guidanceCapabilities";

const catalog = [...segmentAssetCases.map((_item, index) => firstSegmentAssetFixture(index)), firstFileFixture];
const account: GuidanceAccount = { firstName: "Sita", lastName: "Shah", birthDate: "2000-01-01", beneficiaryCount: 1, plan: "premium" };

function setup(flows: GuidanceDefinition[], enabled = true, saved = false, plan = "premium") {
  const calls: Array<{ type: string; args: unknown }> = [];
  const services: GuidanceServices = { ...choiceServices, loadAccount: async () => ({ ...account, plan,
    preferences: Object.fromEntries(flows.map(flow => [flow.segment!.key, enabled])) }),
    loadCatalog: async () => flows, loadContext: async () => Object.fromEntries([...segmentAssetCases.map(item => item.type), "FILE"]
      .map(type => [type, saved ? 1 : 0])),
    runOperation: async (type, args) => { calls.push({ type, args }); return type === "create_item_id" ? "guided_stable_id" : { itemId: args.itemId }; },
    completeObjective: async (id, answers) => { calls.push({ type: "complete", args: { id, answers } });
      return { status: "complete", beneficiaryPersonId: null, data: { preferences: { [flows[0].segment!.key]: true } } }; },
  };
  return { engine: new BrowserGuidanceEngine(services), calls };
}

test("all six first-item flows appear only for enabled, empty, accessible sections", async () => {
  for (const flow of catalog) {
    for (const [enabled, saved, plan] of [[false, false, "premium"], [true, true, "premium"], [true, false, "free"], [true, false, "premium"]] as const) {
      const { engine } = setup([flow], enabled, saved, plan);
      await engine.initialize();
      assert.equal(engine.getSnapshot().current?.objectiveId ?? null,
        enabled && !saved && (plan === "premium" || flow.segment?.planRequired === "free") ? flow.id : null);
    }
  }
});

test("enabling each new section offers its first-item flow in the same session", async () => {
  for (const flow of catalog) {
    const enable: GuidanceDefinition = { ...flow, id: `enable_${flow.segment!.key}`, priority: 40,
      segment: { ...flow.segment!, requireEnabled: false }, contexts: [],
      completedWhen: { path: `account.preferences.${flow.segment!.key}`, operator: "equals", value: true },
      steps: [{ id: "enabled", title: "Enable?", subtext: "Choose", input: { key: "enabled", type: "boolean" } }],
      completion: { mode: "server", fields: ["enabled"], title: "Enabled", subtext: "Continue",
        updateAccount: { preferences: { path: "completion.data.preferences" } } },
    };
    const { engine } = setup([flow, enable], false);
    await engine.initialize();
    assert.equal(engine.getSnapshot().current?.objectiveId, enable.id);
    await engine.submit(true); await engine.continue();
    assert.equal(engine.getSnapshot().current?.objectiveId, flow.id);
  }
});

test("new record flows keep sensitive answers private and complete with only a saved ID", async () => {
  for (const [index, item] of segmentAssetCases.entries()) {
    const { engine, calls } = setup([catalog[index]]);
    await engine.initialize();
    for (const [key, value] of Object.entries(item.answers)) {
      await engine.submit(value);
      if (catalog[index].steps.find(step => step.input?.key === key)?.input?.sensitive) {
        assert.equal(JSON.stringify(engine.getSnapshot()).includes(value), false);
      }
    }
    assert.equal(engine.getSnapshot().current?.result.step, "review");
    assert.equal(calls.length, 0);
    await engine.continue();
    assert.deepEqual(calls.at(-1), { type: "complete", args: { id: item.id, answers: { itemId: "guided_stable_id" } } });
  }
});

test("file selection reviews its name, uploads on confirmation, and never exports the file", async () => {
  const { engine, calls } = setup([firstFileFixture]);
  const file = new File(["private file contents"], "instructions.txt", { type: "text/plain" });
  await engine.initialize();
  await engine.submit("fake-file");
  assert.ok(engine.getSnapshot().error);
  await engine.retry();
  await engine.submit(file);
  assert.equal(engine.getSnapshot().current?.result.subtext, "File: instructions.txt");
  assert.deepEqual(engine.getSnapshot().current?.result.state, {});
  assert.equal(calls.length, 0);
  await engine.continue();
  assert.deepEqual(calls[1], { type: "save_encrypted_file", args: { itemId: "guided_stable_id", file: { name: file.name, file } } });
  assert.deepEqual(calls[2], { type: "complete", args: { id: "add_first_file", answers: { itemId: "guided_stable_id" } } });
  engine.dispose();
  assert.equal(engine.getSnapshot().current, null);
  assert.equal(supportsGuidanceDefinition(firstFileFixture, ["create_item_id", "save_encrypted_file"], ["savedAssets"]), true);
  assert.equal(supportsGuidanceDefinition(firstFileFixture, ["create_item_id"], ["savedAssets"]), false);
});
