// Tests safe restore checks and interrupted upload recovery.
// Owns encrypted fixtures and explicit GraphQL session states.
// Does not contact services or replace saved content.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import CryptoJS from "crypto-js";
import { pathToFileURL } from "node:url";

const key = "committed-key";
const content = CryptoJS.AES.encrypt(JSON.stringify({ type: "note", data: { content: "Newer live content" } }), key).toString();
const getPod = mock.fn(async (): Promise<string | null> => content);
const query = mock.fn(async (_input: any): Promise<any> => ({}));
const mutate = mock.fn(async (_input: any): Promise<any> => ({}));
const input = { id: "existing-note", client: { query, mutate } as any, session: null };
mock.module("../../factory/pod/getPod.ts", { defaultExport: getPod });
mock.module("../debug/logger.ts", { defaultExport: { error: mock.fn() } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn() } });

beforeEach(() => {
  getPod.mock.resetCalls();
  query.mock.resetCalls();
  mutate.mock.resetCalls();
  getPod.mock.mockImplementation(async () => content);
  query.mock.mockImplementation(async () => ({ data: { getUploadPodSession: null, getKeyByRefId: { key } } }));
  mutate.mock.mockImplementation(async () => ({ data: { commitUploadSession: { status: "COMPLETED" } } }));
});

test("a missing pod permits recovery without needing a session key", async () => {
  const { isPodReadable } = await import("./is_pod_readable");
  getPod.mock.mockImplementation(async () => null);
  assert.equal(await isPodReadable(input), false);
  assert.equal(query.mock.callCount(), 0);
});

test("a factor without a key must not permit overwriting existing content", async () => {
  const { isPodReadable } = await import("./is_pod_readable");
  query.mock.mockImplementation(async () => ({ data: { getUploadPodSession: null, getKeyByRefId: null } }));
  await assert.rejects(isPodReadable({ ...input, session: { publicKey: "new-factor", privateKey: "unused" } }), /authentication factor/i);
  assert.equal(mutate.mock.callCount(), 0);
});

test("an unusable key must not permit overwriting existing content", async () => {
  const { isPodReadable } = await import("./is_pod_readable");
  query.mock.mockImplementation(async () => ({ data: { getUploadPodSession: null, getKeyByRefId: { key: "stale-key" } } }));
  await assert.rejects(isPodReadable(input), /decrypt/i);
});

test("interrupted key commits finish before the existing item is accepted", async () => {
  const { isPodReadable } = await import("./is_pod_readable");
  const events: string[] = [];
  let pendingKeys = ["other-factor", "allowed-beneficiary"];
  query.mock.mockImplementation(async ({ query: document }) => {
    const operation = document.definitions[0].name.value;
    events.push(operation);
    return { data: { getUploadPodSession: { id: "pending-session", status: "KEYS_UPLOADED", pod_committed: true }, getKeyByRefId: { key } } };
  });
  mutate.mock.mockImplementation(async ({ variables }) => {
    assert.equal(variables.session_id, "pending-session");
    pendingKeys = pendingKeys.slice(1);
    events.push("commit");
    return { data: { commitUploadSession: { status: pendingKeys.length ? "KEYS_UPLOADED" : "COMPLETED" } } };
  });
  assert.equal(await isPodReadable(input), true);
  assert.deepEqual(pendingKeys, []);
  assert.equal(mutate.mock.callCount(), 2);
  assert.ok(events.lastIndexOf("commit") < events.indexOf("GET_KEY_BY_REF_ID"));
});

test("an interrupted commit error stops restore even when the owner key works", async () => {
  const { isPodReadable } = await import("./is_pod_readable");
  query.mock.mockImplementation(async () => ({ data: { getUploadPodSession: { id: "pending", status: "KEYS_UPLOADED", pod_committed: true }, getKeyByRefId: { key } } }));
  mutate.mock.mockImplementation(async () => { throw new Error("Commit network failure"); });
  await assert.rejects(isPodReadable(input), /Commit network failure/);
});

test("partially staged keys cannot be mistaken for an interrupted commit", async () => {
  const { isPodReadable } = await import("./is_pod_readable");
  query.mock.mockImplementation(async () => ({ data: { getUploadPodSession: { id: "pending", status: "KEYS_UPLOADED", pod_committed: false }, getKeyByRefId: { key } } }));
  await assert.rejects(isPodReadable(input), /incomplete upload/i);
  assert.equal(mutate.mock.callCount(), 0);
});

test("session lookup errors stop restore without committing or replacing data", async () => {
  const { isPodReadable } = await import("./is_pod_readable");
  query.mock.mockImplementation(async () => { throw new Error("Session network failure"); });
  await assert.rejects(isPodReadable(input), /Session network failure/);
  assert.equal(mutate.mock.callCount(), 0);
});
