// What it does: Tests frontend password resets against backend send outcomes.
// What it owns: Public GraphQL requests, skipped results, and failure feedback.
// What it does NOT do: Open a browser or contact the backend or Firebase.

import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import requestPasswordReset from "./requestPasswordReset";

afterEach(() => mock.restoreAll());

test("requests a password reset without depending on a logged-in Firebase user", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({
    data: { requestPasswordReset: { sent: true } },
  })));
  assert.deepEqual(await requestPasswordReset(" user@gmail.com "), { sent: true });
  const [, options] = fetch.mock.calls[0].arguments;
  const body = JSON.parse(options!.body as string);
  assert.equal(body.operationName, "REQUEST_PASSWORD_RESET");
  assert.deepEqual(body.variables, { email: "user@gmail.com" });
  assert.deepEqual(options!.headers, { "Content-Type": "application/json" });
});

test("preserves the backend's unverified-recipient skip", async () => {
  const outcome = { sent: false, reason: "Verify your email first" };
  mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ data: { requestPasswordReset: outcome } })));
  assert.deepEqual(await requestPasswordReset("user@gmail.com"), outcome);
});

test("reports backend provider or cooldown errors without claiming success", async () => {
  mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ errors: [{ message: "Please try again" }] })));
  assert.deepEqual(await requestPasswordReset("user@gmail.com"), { sent: false, reason: "Please try again" });
});

test("reports network failure without claiming an email was sent", async () => {
  mock.method(globalThis, "fetch", async () => { throw new Error("Network unavailable"); });
  assert.equal((await requestPasswordReset("user@gmail.com")).sent, false);
});

test("does not claim success when the response is missing or HTTP fails", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => new Response("{}"));
  assert.equal((await requestPasswordReset("user@gmail.com")).sent, false);
  fetch.mock.mockImplementation(async () => new Response("failure", { status: 500 }));
  assert.equal((await requestPasswordReset("user@gmail.com")).sent, false);
});
