// Verifies guided migration uses complete sessions and reports incomplete access.
// Owns mocked migration and Apollo key-count responses.
// Does not decrypt real data or contact the backend.
import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import type { ApolloClient } from "@apollo/client";

const migrate = mock.fn(async (sourcePublicKey: string) => sourcePublicKey);
mock.module("../../../../common/factor/perform_migrate_in.ts", { defaultExport: migrate });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn() } });

function migrationClient(sourceCount: number, migratedCount: number, publicKeys: string | string[] = "null") {
  return { query: async (request: any) => {
    const name = request.query.definitions[0].name.value;
    if (name === "GET_MY_KEY_COUNT") return { data: { getMyKeyCount: [publicKeys].flat().map(publicKey => ({ count: sourceCount, publicKey })) } };
    if (name === "GET_SMARTWILL_BENEFICIARY") return { data: { getSmartWillBeneficiaries: [{ id: "beneficiary-1", person_id: "person-1" }] } };
    return { data: { getBeneficiaryKeyCount: [{ beneficiary_id: "beneficiary-1", factor_wise_count: [{ publicKey: "null", count: migratedCount }] }] } };
  } } as unknown as ApolloClient;
}

test("partial migration throws so the browser engine can retain a retry", async () => {
  const { migrateGuidedBeneficiary } = await import("./objectiveActionRunner");
  await assert.rejects(migrateGuidedBeneficiary("person-1", { client: migrationClient(3, 2), session: null }), /not fully synced/);
});

test("empty vault requires no migration and a fully synced vault succeeds", async () => {
  const { migrateGuidedBeneficiary } = await import("./objectiveActionRunner");
  migrate.mock.resetCalls();
  await migrateGuidedBeneficiary("person-1", { client: migrationClient(0, 0), session: null });
  assert.equal(migrate.mock.calls.length, 0);
  await migrateGuidedBeneficiary("person-1", { client: migrationClient(3, 3), session: null });
  assert.equal(migrate.mock.calls.length, 1);
});

test("wrong encryption session blocks migration before it can clear beneficiary keys", async () => {
  const { migrateGuidedBeneficiary } = await import("./objectiveActionRunner");
  migrate.mock.resetCalls();
  await assert.rejects(migrateGuidedBeneficiary("person-1", {
    client: migrationClient(3, 0, "required-key"), session: { publicKey: "wrong-key", privateKey: "private" },
  }), /different encryption session/);
  assert.equal(migrate.mock.calls.length, 0);
});

test("the current factor wins equal key counts regardless of response order", async () => {
  const { migrateGuidedBeneficiary } = await import("./objectiveActionRunner");
  for (const publicKeys of [["other-factor", "current-factor"], ["current-factor", "other-factor"]]) {
    migrate.mock.resetCalls();
    await migrateGuidedBeneficiary("person-1", {
      client: migrationClient(3, 3, publicKeys), session: { publicKey: "current-factor", privateKey: "private" },
    });
    assert.equal(migrate.mock.callCount(), 1);
    assert.equal(migrate.mock.calls[0].arguments[0], "current-factor");
  }
});

test("a current factor with fewer keys still blocks migration before any writes", async () => {
  const { migrateGuidedBeneficiary } = await import("./objectiveActionRunner");
  migrate.mock.resetCalls();
  const original = migrationClient(3, 3);
  const client = { query: async (request: any) => {
    if (request.query.definitions[0].name.value !== "GET_MY_KEY_COUNT") return original.query(request);
    return { data: { getMyKeyCount: [
      { publicKey: "current-factor", count: 2 }, { publicKey: "complete-factor", count: 3 },
    ] } };
  } } as unknown as ApolloClient;
  await assert.rejects(migrateGuidedBeneficiary("person-1", {
    client, session: { publicKey: "current-factor", privateKey: "private" },
  }), /different encryption session/);
  assert.equal(migrate.mock.callCount(), 0);
});

test("all beneficiary encryption factors must be synced", async () => {
  const { migrateGuidedBeneficiary } = await import("./objectiveActionRunner");
  const original = migrationClient(3, 3);
  const client = { query: async (request: any) => {
    if (request.query.definitions[0].name.value !== "GET_BENEFICIARY_KEY_COUNT") return original.query(request);
    return { data: { getBeneficiaryKeyCount: [{ beneficiary_id: "beneficiary-1", factor_wise_count: [
      { publicKey: "null", count: 0 }, { publicKey: "first-factor", count: 3 }, { publicKey: "second-factor", count: 2 },
    ] }] } };
  } } as unknown as ApolloClient;
  await assert.rejects(migrateGuidedBeneficiary("person-1", { client, session: null }), /not fully synced/);
});

test("locking during the initial key count stops beneficiary lookup and migration", async () => {
  const { migrateGuidedBeneficiary } = await import("./objectiveActionRunner");
  const controller = new AbortController();
  migrate.mock.resetCalls(); let reads = 0;
  const client = { query: async () => { reads++; controller.abort(); return { data: { getMyKeyCount: [] } }; } } as unknown as ApolloClient;
  await assert.rejects(migrateGuidedBeneficiary("person-1", { client, session: null }, controller.signal), { name: "AbortError" });
  assert.equal(reads, 1); assert.equal(migrate.mock.callCount(), 0);
});
