// Verifies delivery acceptance and authoritative email verification checks.
// Owns token-refresh ordering, stale-account and transport-failure regressions.
// Does not send real email or contact Firebase.
import test from "node:test";
import assert from "node:assert/strict";
import type { ApolloClient } from "@apollo/client";
import type { User } from "firebase/auth";
import { checkEmailVerification, sendVerificationEmail } from "./emailVerification";

test("sending requires explicit backend acceptance", async () => {
  for (const accepted of [false, undefined]) {
    const client = { mutate: async () => ({ data: { sendEmailVerification: accepted } }) } as unknown as ApolloClient;
    await assert.rejects(sendVerificationEmail(client), /Unable to send verification email/);
  }
  await sendVerificationEmail({ mutate: async () => ({ data: { sendEmailVerification: true } }) } as unknown as ApolloClient);
});

test("confirmation reloads Firebase and forces a fresh token before a network account query", async () => {
  for (const verified of [false, true]) {
    const steps: string[] = [];
    const user = { reload: async () => { steps.push("reload"); },
      getIdToken: async (force: boolean) => { assert.equal(force, true); steps.push("token"); } } as unknown as User;
    const client = { query: async (request: { fetchPolicy: string }) => {
      assert.equal(request.fetchPolicy, "network-only"); steps.push("account");
      return { data: { me: { email_verified: verified } } };
    } } as unknown as ApolloClient;
    assert.equal(await checkEmailVerification(client, user), verified);
    assert.deepEqual(steps, ["reload", "token", "account"]);
  }
});

test("failed sends and failed status refreshes remain failures", async () => {
  const client = { mutate: async () => { throw new Error("Delivery unavailable"); } } as unknown as ApolloClient;
  await assert.rejects(sendVerificationEmail(client), /Delivery unavailable/);
  const user = { reload: async () => { throw new Error("Offline"); } } as unknown as User;
  await assert.rejects(checkEmailVerification(client, user), /Offline/);
});
