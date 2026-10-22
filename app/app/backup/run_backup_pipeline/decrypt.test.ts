// Tests export contents, exclusions, and storage-file handling.
// Owns locally encrypted fixtures and key-count consistency checks.
// Does not download live data or write backup files.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import CryptoJS from "crypto-js";

const getPod = mock.fn(async (_id: string): Promise<string | null> => "");
const key = "local-backup-key";
const data = { type: "note", version: "0.0.2", data: { content: "Private note" } };
const model = { id: "note-id", type: "NOTE", metadata: '{"title":"Private"}', ignored_beneficiaries: ["excluded-person"] };
const input = { setStatus: mock.fn(), setProgress: mock.fn(), session: null, client: {} } as any;
mock.module("../../../../factory/pod/getPod.ts", { defaultExport: getPod });
mock.module("../../../../common/debug/logger.ts", { defaultExport: { info: mock.fn(), error: mock.fn() } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn() } });

beforeEach(() => {
  getPod.mock.resetCalls();
  getPod.mock.mockImplementation(async () => CryptoJS.AES.encrypt(JSON.stringify(data), key).toString());
});

test("export preserves data and per-item beneficiary exclusions", async () => {
  const { decryptBackupData } = await import("./decrypt");
  const result = await decryptBackupData(input, { dataCount: { count: 1, publicKey: ["null"] }, maxPublicKey: "null" }, {
    keysByRef: { [model.id]: { ref_id: model.id, key } }, models: [model],
  });
  assert.deepEqual(result, [{ ...model, data }]);
});

test("storage files never enter JSON decryption or the backup", async () => {
  const { decryptBackupData } = await import("./decrypt");
  const result = await decryptBackupData(input, { dataCount: { count: 1, publicKey: ["null"] }, maxPublicKey: "null" }, {
    keysByRef: { [model.id]: { ref_id: model.id, key }, file: { ref_id: "file", key } },
    models: [model, { id: "file", type: "FILE", metadata: "{}" }],
  });
  assert.equal(result.length, 1);
  assert.deepEqual(getPod.mock.calls.map(call => call.arguments[0]), [model.id]);
});

test("missing keys still prevent an incomplete backup from succeeding", async () => {
  const { decryptBackupData } = await import("./decrypt");
  await assert.rejects(decryptBackupData(input, { dataCount: { count: 1, publicKey: ["null"] }, maxPublicKey: "null" }, {
    keysByRef: {}, models: [model],
  }), /Missing data while backing up/);
});
