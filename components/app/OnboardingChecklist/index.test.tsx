// What it does: Checks onboarding milestones without opening a browser.
// What it owns: Null profile, unsaved item, and completed setup regressions.
// What it does NOT do: Contact GraphQL services or modify customer accounts.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

let user = { first_name: "Asha" as string | null, birth_date: "631152000000" as string | null };
let usage = { text_pods: "0", storage_pods: "0" };
let loading = false;
let storageError: Error | undefined;
const beneficiaries = [{}];
const queryNames: string[] = [];

mock.module("@apollo/client/react", { namedExports: {
  useQuery: (query: { definitions: Array<{ name?: { value: string } }> }) => {
    const name = query.definitions[0].name?.value;
    queryNames.push(name || "");
    if (name === "GET_STORAGE_USED") {
      return { data: storageError ? undefined : { getStorageUsed: usage }, loading, error: storageError };
    }
    if (name === "GET_METAMODELS") {
      return { data: { getMetamodels: { models: [{}] } }, loading: false };
    }
    return { data: { getSmartWillBeneficiaries: beneficiaries }, loading: false };
  },
} });
mock.module("../../../contexts/UserSetupContext/index.tsx", {
  namedExports: { useUserContext: () => ({ user, loading: false }) },
});
mock.module("./CompleteProfileStep.tsx", {
  defaultExport: ({ isComplete }: { isComplete: boolean }) => `profile:${isComplete}`,
});
mock.module("./CompleteNoteCreationStep.tsx", {
  defaultExport: ({ isComplete }: { isComplete: boolean }) => `saved:${isComplete}`,
});
mock.module("./AddBeneficiaryStep.tsx", {
  defaultExport: ({ isComplete }: { isComplete: boolean }) => `beneficiary:${isComplete}`,
});

test("onboarding requires profile details and a committed saved item", async () => {
  const { default: OnboardingChecklist } = await import("./index");
  for (const profile of [
    { first_name: null, birth_date: null },
    { first_name: "Asha", birth_date: null },
    { first_name: "   ", birth_date: "631152000000" },
    { first_name: "Asha", birth_date: "0" },
    { first_name: "Asha", birth_date: "invalid" },
  ]) {
    user = profile;
    usage = { text_pods: "64", storage_pods: "0" };
    assert.match(renderToStaticMarkup(OnboardingChecklist()), /profile:false/);
  }

  user = { first_name: "Asha", birth_date: "631152000000" };
  usage = { text_pods: "0", storage_pods: "0" };
  assert.match(renderToStaticMarkup(OnboardingChecklist()), /saved:false/);
  assert.ok(queryNames.includes("GET_STORAGE_USED"));

  loading = true;
  assert.equal(OnboardingChecklist(), null);
  loading = false;
  storageError = new Error("Storage unavailable");
  assert.match(renderToStaticMarkup(OnboardingChecklist()), /saved:false/);
  storageError = undefined;

  for (const saved of [
    { text_pods: "64", storage_pods: "0" },
    { text_pods: "0", storage_pods: "64" },
  ]) {
    usage = saved;
    assert.equal(OnboardingChecklist(), null);
  }
});
