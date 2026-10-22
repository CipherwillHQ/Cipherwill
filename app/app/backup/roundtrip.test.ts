// Tests export-to-restore preservation through the real pipeline and key generation.
// Owns local ZIPs, encrypted text fixtures, and mocked GraphQL/storage boundaries.
// Does not open a browser or contact production services.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import CryptoJS from "crypto-js";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

const original = { type: "note", version: "0.0.2", data: { content: "Private saved note" } };
const model = { id: "roundtrip-note", type: "NOTE", metadata: '{"title":"Private"}', ignored_beneficiaries: ["excluded"] };
const savedKey = "saved-key";
let archive: Blob | undefined;
let restored: any;
let uploadData: any;
const stagedKeys: any[] = [];
const statuses: string[] = [];

mock.module("../../../common/debug/logger.ts", { defaultExport: { info: mock.fn(), error: mock.fn() } });
mock.module("../../../common/time/sleep.ts", { namedExports: { sleep: async () => {} } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn(), success: mock.fn() } });
mock.module(pathToFileURL(require.resolve("file-saver")), { namedExports: { saveAs: (blob: Blob) => { archive = blob; } } });
mock.module("../../../crypto/e0/encrypt.ts", { defaultExport: async (publicKey: string) => `encrypted-for-${publicKey}` });
mock.module("../../../common/data/encrypt_and_upload_pod.ts", { defaultExport: async ({ data_items, require_missing_pod }: any) => {
  assert.equal(require_missing_pod, true);
  uploadData = data_items[0];
  return [{ ref_id: model.id, session_id: "upload-session", type: "TEXT_POD" }];
} });

test("ZIP round trip preserves text and excludes the selected beneficiary from restored keys", async () => {
  const { default: runBackup } = await import("./run_backup");
  const { default: restoreBackup } = await import("./restore_backup");
  const query = mock.fn(async ({ query: document }: any): Promise<any> => {
    switch (document.definitions[0].name.value) {
      case "GET_MY_KEY_COUNT": return { data: { getMyKeyCount: [{ publicKey: "null", count: 1 }] } };
      case "GET_KEY_ITEMS_BY_PUBLIC_KEY": return { data: { getKeyItemsByPublicKey: { items: [{ id: "key", ref_id: model.id, key: savedKey }], has_more: false } } };
      case "GET_METAMODELS": return { data: { getMetamodels: { models: [model, { id: "file", type: "FILE" }], has_more: false } } };
      case "GET_POD": return { data: { getPod: { content: CryptoJS.AES.encrypt(JSON.stringify(original), savedKey).toString() } } };
      case "GET_METAMODEL":
        if (!restored) throw new CombinedGraphQLErrors({ errors: [{ message: "Missing", extensions: { code: "MODEL_NOT_FOUND" } }] });
        return { data: { getMetamodel: restored } };
      case "GET_FACTORS": return { data: { getFactors: [] } };
      case "GET_BENEFICIARY_FACTORS": return { data: { getBeneficiaryFactors: [
        { beneficiary_id: "excluded", publicKey: "excluded-key", factors: [] },
        { beneficiary_id: "allowed", publicKey: "allowed-key", factors: [] },
      ] } };
      default: throw new Error("Unexpected query");
    }
  });
  const mutate = mock.fn(async ({ mutation: document, variables }: any): Promise<any> => {
    switch (document.definitions[0].name.value) {
      case "CREATE_METAMODEL":
        assert.equal(variables.restore, true);
        restored = variables;
        return { data: { createMetamodel: restored } };
      case "uploadSessionKeys":
        stagedKeys.push(...variables.keys);
        return { data: { uploadSessionKeys: { id: "upload-session" } } };
      case "commitUploadSession": return { data: { commitUploadSession: { status: "COMPLETED" } } };
      default: throw new Error("Unexpected mutation");
    }
  });
  const input = {
    client: { query, mutate } as any, session: null, status: "Not started",
    setStatus: (value: string) => statuses.push(value), setProgress: mock.fn(), setDataPoints: mock.fn(), close: mock.fn(),
  };
  await runBackup(input);
  assert.equal(statuses.at(-1), "Completed backup");
  assert.ok(archive);
  await restoreBackup({ ...input, backupFile: new File([archive], "backup.zip") });
  assert.equal(statuses.at(-1), "Backup restored");
  assert.deepEqual(restored.ignored_beneficiaries, ["excluded"]);
  assert.deepEqual(JSON.parse(uploadData.data), original);
  assert.deepEqual(stagedKeys.map(key => key.beneficiary_id), ["null", "allowed"]);
  assert.equal(query.mock.calls[0].arguments[0].variables.exclude_files, true);
});
