// Exercises guarded permission revocation and authoritative list refreshes.
// Owns duplicate submission, server failures, and successful count changes.
// Does not send requests to real accounts or open confirmation dialogs.
import test, { beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { pathToFileURL } from "node:url";
import type { DocumentNode } from "graphql";
import type { AccessDetails } from "@/types/interfaces";

let slots: unknown[] = [], index = 0;
const access: AccessDetails = { id: "grant-1", user: "person-1", beneficiary_id: "relation-1", created_at: "1", expire_at: "2" };
let grants = [access];
let failure: Error | null = null, refreshFailure: Error | null = null;
let confirmed = true, pending: Promise<void> | null = null;
const refresh = mock.fn(async () => { if (refreshFailure) throw refreshFailure; grants = []; return { data: { getAllGrantedBeneficiaries: grants } }; });
const revoke = mock.fn(async () => { await pending; if (failure) throw failure; return { data: { revokeAccessToMyWill: confirmed } }; });
const success = mock.fn();
mock.module("react", { defaultExport: React, namedExports: { ...React,
  useCallback: (callback: unknown) => callback,
  useState: (initial: unknown) => {
    const slot = index++; if (slots[slot] === undefined) slots[slot] = initial;
    return [slots[slot], (value: unknown) => { slots[slot] = value; }];
  },
  useRef: (initial: unknown) => {
    const slot = index++; if (slots[slot] === undefined) slots[slot] = { current: initial }; return slots[slot];
  },
} });
mock.module(pathToFileURL(require.resolve("@apollo/client/react")), { namedExports: {
  useQuery: (query: DocumentNode, options: { fetchPolicy: string }) => {
    assert.equal(options.fetchPolicy, "no-cache");
    const operation = query.definitions.find(definition => definition.kind === "OperationDefinition");
    return operation?.name?.value === "GET_ALL_GRANTED_BENEFICIARIES"
      ? { data: { getAllGrantedBeneficiaries: grants }, refetch: refresh }
      : { data: { getAllBeneficiaryAccess: [] }, refetch: async () => {} };
  }, useMutation: () => [revoke],
} });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { success } });
beforeEach(() => {
  slots = []; index = 0; grants = [access]; failure = null; refreshFailure = null; confirmed = true; pending = null;
  revoke.mock.resetCalls(); refresh.mock.resetCalls(); success.mock.resetCalls();
});
async function controller() {
  const { default: readAccess } = await import("./useGuidanceAccess");
  index = 0; return readAccess();
}

test("successful revocation refreshes the granted list and clears its count", async () => {
  const accessController = await controller();
  await accessController.onRevoke(access.id);
  assert.deepEqual(revoke.mock.calls[0].arguments, [{ variables: { id: "grant-1" } }]);
  assert.equal(refresh.mock.callCount(), 1); assert.equal(success.mock.callCount(), 1);
  const next = await controller();
  assert.equal(next.granted.data?.getAllGrantedBeneficiaries.length, 0);
  assert.equal(next.revokingId, null); assert.equal(next.revokeError, null);
});
test("an in-flight revoke disables its row and prevents duplicate submissions", async () => {
  let release!: () => void;
  pending = new Promise<void>(resolve => { release = resolve; });
  const accessController = await controller();
  const first = accessController.onRevoke(access.id);
  assert.equal((await controller()).revokingId, access.id);
  await accessController.onRevoke(access.id);
  assert.equal(revoke.mock.callCount(), 1);
  release(); await first;
  assert.equal((await controller()).revokingId, null);
});
test("a failed revoke retains permissions and permits retry", async () => {
  failure = new Error("Server rejected revoke");
  await (await controller()).onRevoke(access.id);
  const failed = await controller();
  assert.match(failed.revokeError!, /Unable to revoke/); assert.equal(failed.revokingId, null);
  assert.equal(grants.length, 1); assert.equal(refresh.mock.callCount(), 0);
  failure = null;
  await failed.onRevoke(access.id);
  assert.equal((await controller()).revokeError, null); assert.equal(grants.length, 0);
});
test("unconfirmed mutations do not remove permissions or announce success", async () => {
  confirmed = false;
  await (await controller()).onRevoke(access.id);
  assert.equal(grants.length, 1); assert.equal(refresh.mock.callCount(), 0); assert.equal(success.mock.callCount(), 0);
  assert.match((await controller()).revokeError!, /Unable to revoke/);
});
test("a failed refresh distinguishes a successful revoke from stale list data", async () => {
  refreshFailure = new Error("Refresh unavailable");
  await (await controller()).onRevoke(access.id);
  assert.equal(success.mock.callCount(), 1);
  assert.match((await controller()).revokeError!, /Access was revoked.*could not refresh/);
  assert.equal((await controller()).revokingId, null);
});
