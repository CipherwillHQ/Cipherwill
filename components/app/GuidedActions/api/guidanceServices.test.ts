// Verifies the generic catalog/network boundary with isolated Apollo responses.
// Owns initial query deduplication and JSON completion command contracts.
// Does not access a browser, real account, or encrypted vault.
import test from "node:test";
import assert from "node:assert/strict";
import type { ApolloClient } from "@apollo/client";

test("account and catalog share one read; new answer fields use the generic completion mutation", async (t) => {
  t.mock.module("./operationHandlers.ts", { namedExports: { createOperationHandlers: () => ({
    loadContext: async () => null, runOperation: async () => null,
  }) } });
  const { createGuidanceServices } = await import("./guidanceServices");
  let reads = 0;
  const mutations: Array<{ mutation: any; variables: unknown }> = [];
  const client = {
    query: async () => {
      reads++;
      return { data: { getGuidedObjectiveCatalog: [], getGuidedActionCompletions: ["new_action"],
        getGuidedActionDeferrals: [{ objectiveId: "declined_action", resumeAfter: "1900000000000", dismissed: false }],
        getPreferences: { id: "owner-1", segment_bank_account: true },
        me: { first_name: "Sita", last_name: "Shah", birth_date: null, plan: "premium" }, getSmartWillBeneficiaries: [] } };
    },
    mutate: async (request: { mutation: any; variables: unknown }) => {
      mutations.push(request);
      return { data: { deferGuidedAction: { objectiveId: "declined_action", resumeAfter: "1900000000000", dismissed: false },
        resumeGuidedAction: true, completeGuidedObjective: { status: "complete", beneficiaryPersonId: null, data: { id: "result-1" } } } };
    },
  } as unknown as ApolloClient;
  const services = createGuidanceServices(client, null);
  const [account, catalog] = await Promise.all([services.loadAccount(), services.loadCatalog()]);
  assert.equal(reads, 1);
  assert.deepEqual(account.completedObjectiveIds, ["new_action"]);
  assert.deepEqual(account.deferrals, [{ objectiveId: "declined_action", resumeAfter: "1900000000000", dismissed: false }]);
  assert.equal(account.plan, "premium");
  assert.deepEqual(account.preferences, { id: "owner-1", segment_bank_account: true });
  assert.deepEqual(catalog, []);
  const result = await services.completeObjective("new_action", { customAnswer: "value" });
  assert.deepEqual(result.data, { id: "result-1" });
  assert.deepEqual(mutations[0].variables, { objectiveId: "new_action", answers: { customAnswer: "value" } });
  const operation = mutations[0].mutation.definitions[0];
  assert.equal(operation.selectionSet.selections[0].name.value, "completeGuidedAction");
  assert.equal(operation.variableDefinitions[1].type.type.name.value, "JSON");
  assert.ok(operation.selectionSet.selections[0].selectionSet.selections.some((field: any) => field.name.value === "recovery"));
  await services.deferObjective("declined_action", false);
  assert.deepEqual(mutations[1].variables, { objectiveId: "declined_action", dismiss: false });
  assert.equal(mutations[1].mutation.definitions[0].selectionSet.selections[0].name.value, "deferGuidedAction");
  await services.resumeObjective("declined_action");
  assert.deepEqual(mutations[2].variables, { objectiveId: "declined_action" });
  assert.equal(mutations[2].mutation.definitions[0].selectionSet.selections[0].name.value, "resumeGuidedAction");
});

test("failed initial queries can retry without reusing the rejected promise", async () => {
  const { createGuidanceServices } = await import("./guidanceServices");
  let reads = 0;
  const client = { query: async () => {
    if (++reads === 1) throw new Error("Offline");
    return { data: { getGuidedObjectiveCatalog: [], getGuidedActionCompletions: [],
      getGuidedActionDeferrals: [], getPreferences: { id: "owner-1" },
      me: { first_name: "Sita", last_name: "Shah", birth_date: null, plan: "free" }, getSmartWillBeneficiaries: [] } };
  } } as unknown as ApolloClient;
  const services = createGuidanceServices(client, null);
  await assert.rejects(Promise.all([services.loadAccount(), services.loadCatalog()]));
  await Promise.all([services.loadAccount(), services.loadCatalog()]);
  assert.equal(reads, 2);
});
