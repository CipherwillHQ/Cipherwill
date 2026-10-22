// Tests restore completion, recovery, and beneficiary exclusions.
// Owns local backup fixtures and mocked GraphQL/upload outcomes.
// Does not open a browser or contact the backend.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import CryptoJS from "crypto-js";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

const upload = mock.fn(async (_input: any) => {});
const query = mock.fn(async (_input: any): Promise<any> => ({}));
const mutate = mock.fn(async (_input: any): Promise<any> => ({}));
const statuses: string[] = [];
const item = {
  id: "saved-note", type: "NOTE", metadata: '{"title":"Private"}',
  ignored_beneficiaries: ["excluded-person"],
  data: { type: "note", version: "0.0.2", data: { content: "Saved text" } },
};
const input = { client: { query, mutate } as any, session: null, setStatus: (value: string) => statuses.push(value) };

mock.module("../../../../common/data/upload_pod_data.ts", { defaultExport: upload });
mock.module("../../../../common/debug/logger.ts", { defaultExport: { info: mock.fn(), error: mock.fn() } });
mock.module("../../../../common/time/sleep.ts", { namedExports: { sleep: async () => {} } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn(), success: mock.fn() } });

beforeEach(() => {
  statuses.length = 0;
  query.mock.resetCalls();
  mutate.mock.resetCalls();
  upload.mock.resetCalls();
  upload.mock.mockImplementation(async () => {});
  query.mock.mockImplementation(async () => { throw new CombinedGraphQLErrors({ errors: [{ message: "Missing", extensions: { code: "MODEL_NOT_FOUND" } }] }); });
  mutate.mock.mockImplementation(async () => ({ data: { createMetamodel: { id: item.id } } }));
});

test("failed uploads never finish restore successfully", async () => {
  const { default: restore } = await import("../restore_backup");
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  zip.file("backup.json", JSON.stringify({ type: "CIPHERWILL_BACKUP", version: "0.0.2", data: [item] }));
  const bytes = await zip.generateAsync({ type: "uint8array" });
  upload.mock.mockImplementation(async () => { throw new Error("Network failure"); });
  await restore({ ...input, backupFile: new File([bytes as Uint8Array<ArrayBuffer>], "backup.zip", { type: "application/zip" }) });
  assert.equal(statuses.at(-1), "Error while restoring backup");
  assert.equal(statuses.includes("Backup restored"), false);
});

test("retry recovers content when metadata exists without a pod", async () => {
  const { runRestoreLoop } = await import("./restore");
  query.mock.mockImplementation(async ({ query: document }) => document.definitions[0].name.value === "GET_METAMODEL"
    ? { data: { getMetamodel: { id: item.id, ignored_beneficiaries: item.ignored_beneficiaries } } }
    : { data: { getPod: null } });
  await runRestoreLoop(input, { version: "0.0.2", data: [item] });
  assert.equal(upload.mock.callCount(), 1);
  assert.equal(mutate.mock.callCount(), 0);
  assert.equal(upload.mock.calls[0].arguments[0].require_missing_pod, true);
});

test("restore preserves readable existing content", async () => {
  const { runRestoreLoop } = await import("./restore");
  query.mock.mockImplementation(async () => ({ data: {
    getMetamodel: { id: item.id },
    getUploadPodSession: null,
    getPod: { content: CryptoJS.AES.encrypt(JSON.stringify(item.data), "saved-key").toString() },
    getKeyByRefId: { key: "saved-key" },
  } }));
  await runRestoreLoop(input, { version: "0.0.2", data: [item] });
  assert.equal(upload.mock.callCount(), 0);
  assert.equal(mutate.mock.callCount(), 0);
});

test("retry repairs a pod committed before its keys", async () => {
  const { runRestoreLoop } = await import("./restore");
  let committed = false;
  query.mock.mockImplementation(async () => ({ data: {
    getMetamodel: { id: item.id },
    getUploadPodSession: { id: "pending", status: "KEYS_UPLOADED", pod_committed: true },
    getPod: { content: CryptoJS.AES.encrypt(JSON.stringify(item.data), "new-key").toString() },
    getKeyByRefId: { key: committed ? "new-key" : "stale-key" },
  } }));
  mutate.mock.mockImplementation(async () => {
    committed = true;
    return { data: { commitUploadSession: { status: "COMPLETED" } } };
  });
  await runRestoreLoop(input, { version: "0.0.2", data: [item] });
  assert.equal(upload.mock.callCount(), 0);
  assert.equal(mutate.mock.callCount(), 1);
  assert.equal(mutate.mock.calls[0].arguments[0].variables.session_id, "pending");
});

test("restore sends exclusions when creating metadata before uploading", async () => {
  const { runRestoreLoop } = await import("./restore");
  await runRestoreLoop(input, { version: "0.0.2", data: [item] });
  assert.deepEqual(mutate.mock.calls[0].arguments[0].variables.ignored_beneficiaries, item.ignored_beneficiaries);
  assert.equal(mutate.mock.calls[0].arguments[0].variables.restore, true);
  assert.equal(upload.mock.callCount(), 1);
});

test("retry preserves current exclusions and restores missing backup exclusions", async () => {
  const { runRestoreLoop } = await import("./restore");
  query.mock.mockImplementation(async ({ query: document }) => document.definitions[0].name.value === "GET_METAMODEL"
    ? { data: { getMetamodel: { id: item.id, type: "NOTE", metadata: item.metadata, ignored_beneficiaries: ["currently-excluded"] } } }
    : { data: { getPod: null } });
  await runRestoreLoop(input, { version: "0.0.2", data: [item] });
  assert.deepEqual(mutate.mock.calls[0]?.arguments[0].variables.ignored_beneficiaries, ["excluded-person"]);
  assert.equal(mutate.mock.calls[0]?.arguments[0].variables.restore, true);
  assert.equal(upload.mock.callCount(), 1);
});

test("network errors checking an existing pod abort without overwriting it", async () => {
  const { runRestoreLoop } = await import("./restore");
  query.mock.mockImplementation(async ({ query: document }) => {
    if (document.definitions[0].name.value === "GET_METAMODEL") return { data: { getMetamodel: { id: item.id } } };
    throw new Error("Network unavailable");
  });
  await assert.rejects(runRestoreLoop(input, { version: "0.0.2", data: [item] }), /Network unavailable/);
  assert.equal(upload.mock.callCount(), 0);
});

test("a factor missing its key preserves newer content and stops restore", async () => {
  const { runRestoreLoop } = await import("./restore");
  query.mock.mockImplementation(async () => ({ data: {
    getMetamodel: { id: item.id }, getUploadPodSession: null, getKeyByRefId: null,
    getPod: { content: CryptoJS.AES.encrypt(JSON.stringify({ ...item.data, data: { content: "Newer saved text" } }), "other-factor-key").toString() },
  } }));
  await assert.rejects(runRestoreLoop({ ...input, session: { publicKey: "new-factor", privateKey: "unused" } }, { version: "0.0.2", data: [item] }), /authentication factor/i);
  assert.equal(upload.mock.callCount(), 0);
  assert.equal(mutate.mock.callCount(), 0);
});

test("retry completes beneficiary keys before reporting Backup restored", async () => {
  const { default: restore } = await import("../restore_backup");
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  zip.file("backup.json", JSON.stringify({ type: "CIPHERWILL_BACKUP", version: "0.0.2", data: [item] }));
  const bytes = await zip.generateAsync({ type: "uint8array" });
  let remainingKeys = ["other-factor", "allowed-beneficiary"];
  query.mock.mockImplementation(async () => ({ data: {
    getMetamodel: { id: item.id },
    getUploadPodSession: { id: "pending", status: "KEYS_UPLOADED", pod_committed: true },
    getPod: { content: CryptoJS.AES.encrypt(JSON.stringify(item.data), "saved-key").toString() },
    getKeyByRefId: { key: "saved-key" },
  } }));
  mutate.mock.mockImplementation(async () => {
    remainingKeys = remainingKeys.slice(1);
    return { data: { commitUploadSession: { status: remainingKeys.length ? "KEYS_UPLOADED" : "COMPLETED" } } };
  });
  const backupFile = new File([bytes as Uint8Array<ArrayBuffer>], "backup.zip");
  await restore({ ...input, backupFile });
  assert.equal(statuses.at(-1), "Backup restored");
  assert.deepEqual(remainingKeys, []);
  assert.equal(upload.mock.callCount(), 0);

  statuses.length = 0;
  mutate.mock.mockImplementation(async () => { throw new Error("Commit failed"); });
  await restore({ ...input, backupFile });
  assert.equal(statuses.at(-1), "Error while restoring backup");
  assert.equal(statuses.includes("Backup restored"), false);
});

test("restore skips storage-file entries", async () => {
  const { runRestoreLoop } = await import("./restore");
  await runRestoreLoop(input, { version: "0.0.2", data: [{ id: "file", type: "FILE" }] });
  assert.equal(query.mock.callCount(), 0);
  assert.equal(mutate.mock.callCount(), 0);
  assert.equal(upload.mock.callCount(), 0);
});
