// Verifies guided retries resume only fully staged uploads with saved ciphertext.
// Owns commit-state, missing-content, and cancellation fixtures.
// Does not decrypt content or create metadata, keys, or upload sessions.
import test from "node:test";
import assert from "node:assert/strict";
import type { ApolloClient } from "@apollo/client";
import { resumeGuidedAssetUpload } from "./resumeAssetUpload";

function setup(status: string | null, podCommitted = false, content: string | null = "ciphertext") {
  const calls: string[] = [];
  let commits = 0;
  const client = {
    query: async ({ query, fetchPolicy }: any) => {
      assert.equal(fetchPolicy, "no-cache");
      const name = query.definitions[0].name.value;
      calls.push(name);
      return name === "GET_UPLOAD_POD_SESSION" ? { data: { getUploadPodSession: status
        ? { id: "upload-1", status, pod_committed: podCommitted } : null } }
        : { data: { getPod: { content } } };
    },
    mutate: async ({ variables }: any) => {
      assert.deepEqual(variables, { session_id: "upload-1" });
      calls.push("commit");
      return { data: { commitUploadSession: { status: ++commits === 1 ? "KEYS_UPLOADED" : "COMPLETED" } } };
    },
  } as unknown as ApolloClient;
  return { client, calls };
}

test("missing and partially staged uploads are not mistaken for completed saves", async () => {
  for (const status of [null, "CREATED", "PODS_UPLOADED", "KEYS_UPLOADED"]) {
    const { client, calls } = setup(status);
    assert.equal(await resumeGuidedAssetUpload(client, "guided_item"), false);
    assert.deepEqual(calls, ["GET_UPLOAD_POD_SESSION"]);
  }
});

test("fully staged uploads finish the commit loop before confirming saved ciphertext", async () => {
  const { client, calls } = setup("KEYS_UPLOADED", true);
  assert.equal(await resumeGuidedAssetUpload(client, "guided_item"), true);
  assert.deepEqual(calls, ["GET_UPLOAD_POD_SESSION", "commit", "commit", "GET_POD"]);
});

test("completed uploads require ciphertext and never upload keys or content again", async () => {
  const { client, calls } = setup("COMPLETED");
  assert.equal(await resumeGuidedAssetUpload(client, "guided_item"), true);
  assert.deepEqual(calls, ["GET_UPLOAD_POD_SESSION", "GET_POD"]);
  await assert.rejects(resumeGuidedAssetUpload(setup("COMPLETED", true, null).client, "guided_item"), /unavailable/);
  const broken = { query: async () => ({}) } as unknown as ApolloClient;
  await assert.rejects(resumeGuidedAssetUpload(broken, "guided_item"), /unavailable/);
});

test("locking during the session read prevents a follow-up commit or ciphertext read", async () => {
  const controller = new AbortController();
  const client = { query: async () => {
    controller.abort();
    return { data: { getUploadPodSession: { id: "upload-1", status: "KEYS_UPLOADED", pod_committed: true } } };
  } } as unknown as ApolloClient;
  await assert.rejects(resumeGuidedAssetUpload(client, "guided_item", controller.signal), { name: "AbortError" });
});
