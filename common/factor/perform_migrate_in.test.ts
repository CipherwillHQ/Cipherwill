// Verifies cancellation prevents later migration reads, crypto, and uploads.
// Owns mocked paginated requests with the real migration orchestration.
// Does not read private vault data or perform browser automation.
import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import type { ApolloClient } from "@apollo/client";
const encrypt = mock.fn(async () => "wrapped");
const decrypt = mock.fn(async () => "plaintext-key");
const upload = mock.fn(async () => {});
mock.module("../../crypto/e0/encrypt.ts", { defaultExport: encrypt });
mock.module("../../crypto/e0/decrypt.ts", { defaultExport: decrypt });
mock.module("../data/recurring_upload.ts", { defaultExport: upload });
mock.module("../debug/logger.ts", { defaultExport: { info: mock.fn(), error: mock.fn() } });
mock.module("../time/debug_sleep.ts", { namedExports: { debug_sleep: async () => {} } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn() } });

test("locking during beneficiary-factor lookup prevents key deletion and pagination", async () => {
  const { default: migrate } = await import("./perform_migrate_in");
  const controller = new AbortController();
  const mutations = mock.fn(); let reads = 0;
  const client = { query: async () => { reads++; controller.abort(); return { data: {} }; }, mutate: mutations } as unknown as ApolloClient;
  await assert.rejects(migrate("source", client, "target", "private", "beneficiary", controller.signal), { name: "AbortError" });
  assert.equal(reads, 1); assert.equal(mutations.mock.callCount(), 0);
});

test("locking during page lookup prevents decrypting or uploading its results", async () => {
  const { default: migrate } = await import("./perform_migrate_in");
  const controller = new AbortController();
  encrypt.mock.resetCalls(); decrypt.mock.resetCalls(); upload.mock.resetCalls();
  const client = { query: async () => { controller.abort(); return { data: { getKeyItemsByPublicKey: {
    items: [{ id: "one", publicKey: "null", key: "private-key", ref_id: "ref" }], has_more: true,
  } } }; } } as unknown as ApolloClient;
  await assert.rejects(migrate("source", client, "target", "private", undefined, controller.signal), { name: "AbortError" });
  assert.equal(encrypt.mock.callCount(), 0); assert.equal(upload.mock.callCount(), 0);
});

test("locking after the first crypto operation prevents the next key and upload", async () => {
  const { transformMigrationKeys } = await import("./transformMigrationKeys");
  const controller = new AbortController();
  encrypt.mock.resetCalls(); upload.mock.resetCalls();
  encrypt.mock.mockImplementationOnce(async () => { controller.abort(); return "wrapped"; });
  await assert.rejects(transformMigrationKeys([
    { publicKey: "null", key: "first", ref_id: "one", beneficiary_id: "null" },
    { publicKey: "null", key: "second", ref_id: "two", beneficiary_id: "null" },
  ], null, "target", undefined, undefined, controller.signal), { name: "AbortError" });
  assert.equal(encrypt.mock.callCount(), 1); assert.equal(upload.mock.callCount(), 0);
});
