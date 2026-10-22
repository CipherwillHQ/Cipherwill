// Tests completion guarantees for the shared upload commit loop.
// Owns mocked multi-batch responses and failed commit outcomes.
// Does not stage keys, replace saved data, or contact the backend.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { commitSessionUntilCompleted } from "./commit_upload_session";

test("a commit that remains unfinished never returns success", async () => {
  const mutate = mock.fn(async () => ({ data: { commitUploadSession: { status: "KEYS_UPLOADED" } } }));
  await assert.rejects(commitSessionUntilCompleted({ client: { mutate } as any, session_id: "pending" }), /did not complete/);
  assert.equal(mutate.mock.callCount(), 30);
});

test("unexpected or missing commit responses fail immediately", async () => {
  for (const response of [{ data: { commitUploadSession: { status: "PODS_UPLOADED" } } }, { data: {} }]) {
    const mutate = mock.fn(async () => response);
    await assert.rejects(commitSessionUntilCompleted({ client: { mutate } as any, session_id: "pending" }), /Unexpected upload session status/);
    assert.equal(mutate.mock.callCount(), 1);
  }
});
