// Verifies first-item flows review locally and complete with only a saved ID.
// Owns required questions, password privacy, retry checkpoints, and disposal tests.
// Does not run a browser or replace the encrypted-upload integration tests.
import test from "node:test";
import assert from "node:assert/strict";
import type { GuidanceDefinition, GuidanceServices } from "@/types/interfaces";
import { BrowserGuidanceEngine } from "./browserEngine";
import { choiceServices } from "./fixtures/choices";
import { assetCases, firstAssetFixture } from "./fixtures/firstAsset";
import { testAssetSchemas } from "./fixtures/assetSchemas";

function setup(catalog: GuidanceDefinition[], overrides: Partial<GuidanceServices> = {}) {
  const calls: Array<{ type: string; args: unknown }> = [];
  const services: GuidanceServices = {
    loadCatalog: async () => catalog,
    ...choiceServices,
    loadAccount: async () => ({ firstName: "Sita", lastName: "Shah", birthDate: "2000-01-01", beneficiaryCount: 1 }),
    loadContext: async () => ({ NOTE: 0, BANK_ACCOUNT: 0, PASSWORD: 0 }),
    runOperation: async (type, args) => {
      calls.push({ type, args });
      return type === "create_item_id" ? "guided_stable_id" : { itemId: args.itemId };
    },
    completeObjective: async (objectiveId, answers) => {
      calls.push({ type: "complete", args: { objectiveId, answers } });
      return { status: "complete", beneficiaryPersonId: null };
    },
    ...overrides,
  };
  return { engine: new BrowserGuidanceEngine(services), calls };
}

test("all three flows require answers and review before saving, then complete with only the item ID", async () => {
  for (const [index, item] of assetCases.entries()) {
    const { engine, calls } = setup([firstAssetFixture(index)]);
    await engine.initialize();
    await engine.continue();
    assert.equal(engine.getSnapshot().current?.result.step, item.fields[0]);
    await engine.submit("");
    assert.ok(engine.getSnapshot().error);
    await engine.retry();
    for (const [fieldIndex, value] of item.values.entries()) {
      assert.equal(engine.getSnapshot().current?.result.step, item.fields[fieldIndex]);
      await engine.submit(value);
    }
    const review = engine.getSnapshot().current!.result;
    assert.equal(review.step, "review");
    assert.equal(review.continueLabel, "Encrypt and save");
    assert.equal(calls.length, 0);
    if (item.type === "PASSWORD") assert.doesNotMatch(JSON.stringify(engine.getSnapshot()), /Secret password/);
    await engine.continue();
    assert.deepEqual(calls.map(call => call.type), ["create_item_id", "save_encrypted_asset", "complete"]);
    assert.deepEqual(calls[1].args, { schema: testAssetSchemas[item.type], itemId: "guided_stable_id",
      ...Object.fromEntries(item.fields.map((field, i) => [field, item.values[i]])) });
    assert.deepEqual(calls[2].args, { objectiveId: item.id, answers: { itemId: "guided_stable_id" } });
    assert.equal(engine.getSnapshot().current?.result.action, "complete");
    if (item.type === "PASSWORD") assert.doesNotMatch(JSON.stringify(engine.getSnapshot()), /Secret password/);
  }
});

test("upload and completion retries retain one item identity and do not repeat a successful save", async () => {
  let ids = 0;
  let uploads = 0;
  let completions = 0;
  const { engine } = setup([firstAssetFixture(2)], {
    runOperation: async (type, args) => {
      if (type === "create_item_id") { ids++; return "guided_retry_id"; }
      assert.equal(args.itemId, "guided_retry_id");
      assert.equal(args.password, "  Secret password  ");
      if (++uploads === 1) throw new Error("Private upload error");
      return { itemId: args.itemId };
    },
    completeObjective: async (_id, answers) => {
      assert.deepEqual(answers, { itemId: "guided_retry_id" });
      if (++completions === 1) throw new Error("Lost completion response");
      return { status: "complete", beneficiaryPersonId: null };
    },
  });
  await engine.initialize();
  for (const value of assetCases[2].values) await engine.submit(value);
  await engine.continue();
  assert.ok(engine.getSnapshot().error);
  await engine.retry();
  assert.ok(engine.getSnapshot().error);
  await engine.retry();
  assert.equal(engine.getSnapshot().current?.result.action, "complete");
  assert.deepEqual([ids, uploads, completions], [1, 2, 2]);
  assert.doesNotMatch(JSON.stringify(engine.getSnapshot()), /Secret password|Private upload error/);
});

test("saved categories are excluded while unfinished categories remain available", async () => {
  const catalog = assetCases.map((_item, index) => firstAssetFixture(index));
  const overrides = { loadContext: async () => ({ NOTE: 1, BANK_ACCOUNT: 0, PASSWORD: 1 }) };
  const { engine, calls } = setup(catalog, overrides);
  await engine.initialize();
  assert.equal(engine.getSnapshot().current?.objectiveId, "add_first_bank_account");
  await engine.initialize();
  assert.equal(engine.getSnapshot().current?.objectiveId, "add_first_bank_account");
  assert.equal(calls.length, 0);
  const nextSession = setup(catalog, overrides).engine;
  await nextSession.initialize();
  assert.equal(nextSession.getSnapshot().current?.objectiveId, "add_first_bank_account");
});

test("disposing during a save aborts its signal and prevents later completion or secret state", async () => {
  let signal: AbortSignal | undefined;
  let finish!: (value: unknown) => void;
  const { engine, calls } = setup([firstAssetFixture(2)], {
    runOperation: async (type, _args, operationSignal) => {
      if (type === "create_item_id") return "guided_disposed_id";
      signal = operationSignal;
      return new Promise(resolve => { finish = resolve; });
    },
  });
  await engine.initialize();
  for (const value of assetCases[2].values) await engine.submit(value);
  const pending = engine.continue();
  await new Promise(resolve => setImmediate(resolve));
  engine.dispose();
  assert.equal(signal?.aborted, true);
  finish({ itemId: "guided_disposed_id" });
  await pending;
  assert.equal(calls.length, 0);
  assert.equal(engine.getSnapshot().current, null);
  assert.doesNotMatch(JSON.stringify(engine.getSnapshot()), /Secret password/);
});
