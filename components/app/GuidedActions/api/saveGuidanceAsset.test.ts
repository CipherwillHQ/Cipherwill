// Verifies guided saves encrypt content and reuse item identity after failures.
// Owns mocked recipient-key generation with the real AES/upload orchestration.
// Does not access a browser, backend, or real vault.
import test, { beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import CryptoJS from "crypto-js";
import type { ApolloClient } from "@apollo/client";
import { pathToFileURL } from "node:url";
import { testAssetSchemas } from "../core/fixtures/assetSchemas";

const encryptionKey = "browser-only-key";
const ownKeys = mock.fn(async ({ key_cluster, encryption_keys }: any) => {
  for (const ref_id of Object.keys(encryption_keys)) key_cluster.push({ ref_id, publicKey: "owner-factor", beneficiary_id: "null", key: "wrapped-owner-key" });
});
const beneficiaryKeys = mock.fn(async ({ key_cluster, encryption_keys }: any) => {
  for (const ref_id of Object.keys(encryption_keys)) key_cluster.push({ ref_id, publicKey: "beneficiary-factor", beneficiary_id: "beneficiary-1", key: "wrapped-beneficiary-key" });
});
mock.module("../../../../common/data/generate_encryption_keys.ts", { defaultExport: async ({ data_items }: any) =>
  Object.fromEntries(data_items.map((item: any) => [item.ref_id, { metamodel_ref_id: item.ref_id, key: encryptionKey }])) });
mock.module("../../../../common/data/generate_keys_for_own_factors.ts", { defaultExport: ownKeys });
mock.module("../../../../common/data/generate_keys_for_beneficiaries.ts", { defaultExport: beneficiaryKeys });
mock.module("../../../../common/debug/logger.ts", { defaultExport: { info: mock.fn(), error: mock.fn() } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn() } });

beforeEach(() => { ownKeys.mock.resetCalls(); beneficiaryKeys.mock.resetCalls(); });

function setup() {
  const requests: Array<{ name: string; variables: any }> = [];
  const files: string[] = [];
  let status: string | null = null;
  let loseCommitResponse = false;
  const evict = mock.fn();
  const client = {
    cache: { evict },
    query: async ({ query, variables }: any) => {
      const name = query.definitions[0].name.value;
      requests.push({ name, variables });
      if (name === "GET_UPLOAD_POD_SESSION") return { data: { getUploadPodSession: status
        ? { id: "upload-1", status, type: "TEXT_POD", pod_committed: status === "COMPLETED" } : null } };
      if (name === "GET_POD") return { data: { getPod: { content: files.at(-1) } } };
      return { data: { getMetamodel: { ignored_beneficiaries: [] } } };
    },
    mutate: async ({ mutation, variables }: any) => {
      const name = mutation.definitions[0].name.value;
      requests.push({ name, variables });
      if (name === "CREATE_METAMODEL") return { data: { createMetamodel: { id: variables.id } } };
      if (name === "createUploadPodSession") { status = "CREATED"; return { data: { createUploadPodSession: { id: "upload-1", type: "TEXT_POD" } } }; }
      if (name === "uploadSessionPod") { files.push(await variables.file.text()); status = "PODS_UPLOADED"; return { data: { uploadSessionPod: { id: "upload-1" } } }; }
      if (name === "uploadSessionKeys") { status = "KEYS_UPLOADED"; return { data: { uploadSessionKeys: { id: "upload-1" } } }; }
      assert.equal(name, "commitUploadSession");
      status = "COMPLETED";
      if (loseCommitResponse) { loseCommitResponse = false; throw new Error("Lost response"); }
      return { data: { commitUploadSession: { status } } };
    },
  } as unknown as ApolloClient;
  return { client, requests, files, evict, loseNextCommitResponse: () => { loseCommitResponse = true; } };
}

test("note, bank, and password content is encrypted before upload and recipient key generation is reused", async () => {
  const { saveGuidanceAsset } = await import("./saveGuidanceAsset");
  for (const args of [
    { type: "NOTE", itemId: "guided_note", title: "Family message", content: "private-note\n<script>" },
    { type: "BANK_ACCOUNT", itemId: "guided_bank", bankName: "Example Bank", accountNumber: "001-private-account" },
    { type: "PASSWORD", itemId: "guided_password", service: "Example Service", username: "account@example.com", password: "  private-password  " },
  ]) {
    const { client, files, requests } = setup();
    const result = await saveGuidanceAsset(client, { publicKey: "owner-factor", privateKey: "unused" }, { ...args, schema: testAssetSchemas[args.type] });
    assert.deepEqual(result, { itemId: args.itemId });
    const plaintext = CryptoJS.AES.decrypt(files[0], encryptionKey).toString(CryptoJS.enc.Utf8);
    const pod = JSON.parse(plaintext);
    if (args.type === "NOTE") { assert.equal(pod.version, "0.0.2"); assert.equal(pod.data.content, "<p>private-note<br>&lt;script&gt;</p>"); }
    if (args.type === "BANK_ACCOUNT") assert.equal(pod.data.account_number, args.accountNumber);
    if (args.type === "PASSWORD") assert.equal(pod.data.password, args.password);
    assert.doesNotMatch(JSON.stringify(requests), /private-note|private-account|private-password|browser-only-key|unused/);
    assert.doesNotMatch(files[0], /private-note|private-account|private-password/);
    const keys = requests.find(request => request.name === "uploadSessionKeys")!.variables.keys;
    assert.equal(keys.length, 2);
    assert.equal(keys[1].beneficiary_id, "beneficiary-1");
  }
  assert.equal(ownKeys.mock.callCount(), 3);
  assert.equal(beneficiaryKeys.mock.callCount(), 3);
});

test("a lost commit response retries the same committed item without another item or ciphertext upload", async () => {
  const { saveGuidanceAsset } = await import("./saveGuidanceAsset");
  const { client, requests, evict, loseNextCommitResponse } = setup();
  const args = { schema: testAssetSchemas.NOTE, itemId: "guided_note", title: "Family", content: "Private message" };
  loseNextCommitResponse();
  await assert.rejects(saveGuidanceAsset(client, null, args), /Lost response/);
  assert.deepEqual(await saveGuidanceAsset(client, null, args), { itemId: "guided_note" });
  assert.equal(requests.filter(request => request.name === "CREATE_METAMODEL").length, 1);
  assert.equal(requests.filter(request => request.name === "uploadSessionPod").length, 1);
  assert.equal(evict.mock.callCount(), 2);
});

test("locking after metadata creation prevents the subsequent encrypted upload", async () => {
  const { saveGuidanceAsset } = await import("./saveGuidanceAsset");
  const controller = new AbortController();
  let writes = 0;
  const client = { query: async () => ({ data: { getUploadPodSession: null } }),
    mutate: async ({ variables }: any) => { writes++; controller.abort(); return { data: { createMetamodel: { id: variables.id } } }; },
  } as unknown as ApolloClient;
  await assert.rejects(saveGuidanceAsset(client, null,
    { schema: testAssetSchemas.NOTE, itemId: "guided_note", title: "Family", content: "Message" }, controller.signal), { name: "AbortError" });
  assert.equal(writes, 1);
  assert.equal(ownKeys.mock.callCount(), 0);
});

test("locking after upload-session creation prevents ciphertext, keys, and commits", async () => {
  const { saveGuidanceAsset } = await import("./saveGuidanceAsset");
  const controller = new AbortController();
  const base = setup();
  const client = { ...base.client, mutate: async (request: any) => {
    const response = await base.client.mutate(request);
    if (request.mutation.definitions[0].name.value === "createUploadPodSession") controller.abort();
    return response;
  } } as unknown as ApolloClient;
  await assert.rejects(saveGuidanceAsset(client, null,
    { schema: testAssetSchemas.NOTE, itemId: "guided_note", title: "Family", content: "Private" }, controller.signal), { name: "AbortError" });
  assert.equal(base.files.length, 0);
  assert.equal(ownKeys.mock.callCount(), 0);
  assert.equal(base.requests.some(request => request.name === "uploadSessionKeys" || request.name === "commitUploadSession"), false);
});
