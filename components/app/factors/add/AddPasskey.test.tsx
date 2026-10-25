// Verifies passkey enrollment submits public metadata and awaits synchronization.
// Owns cancellation, duplicate-click and interrupted-API regressions.
// Does not open a credential provider or use real account data.
import assert from "node:assert/strict";
import { before, beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
const enroll = mock.fn(async () => ({ publicKey: "public", nonce: "nonce" }));
const create = mock.fn(async (_request: any) => ({ data: { createFactor: { publicKey: "public" } } }));
const sync = mock.fn(async (..._args: any[]) => {});
const error = mock.fn();
let click: () => Promise<void>;
mock.module("@apollo/client/react", { namedExports: {
  useApolloClient: () => "client", useMutation: () => [create, { loading: false }],
} });
mock.module("../../../../contexts/SessionContext/index.tsx", { namedExports: { useSession: () => ({ session: "session" }) } });
mock.module("../../../../contexts/UserSetupContext/index.tsx", { namedExports: { useUserContext: () => ({ user: { id: "u", email: "test@example.test" } }) } });
mock.module("../../../../common/factor/passkeyFactor.ts", { namedExports: {
  createPasskeyFactor: enroll, passkeyErrorMessage: (failure: Error) => failure.message,
} });
mock.module("./continuousFactorIn.ts", { defaultExport: sync });
mock.module("../../../common/SimpleButton.tsx", { defaultExport: (props: { onClick: typeof click; children: React.ReactNode }) => {
  click = props.onClick; return <button>{props.children}</button>;
} });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error } });
let AddPasskey: typeof import("./AddPasskey").default;
before(async () => { AddPasskey = (await import("./AddPasskey")).default; });
beforeEach(() => {
  enroll.mock.resetCalls(); create.mock.resetCalls(); sync.mock.resetCalls(); error.mock.resetCalls();
  enroll.mock.mockImplementation(async () => ({ publicKey: "public", nonce: "nonce" }));
  create.mock.mockImplementation(async () => ({ data: { createFactor: { publicKey: "public" } } }));
  renderToStaticMarkup(<AddPasskey continuous />);
});
test("a single enrollment sends only public factor metadata and then synchronizes", async () => {
  await Promise.all([click(), click()]);
  assert.equal(enroll.mock.callCount(), 1);
  assert.equal(create.mock.callCount(), 1);
  assert.deepEqual(create.mock.calls[0].arguments[0], { variables: {
    name: "Passkey", type: "passkey", publicKey: "public", nonce: "nonce",
  } });
  assert.deepEqual(sync.mock.calls[0].arguments, [{ createFactor: { publicKey: "public" } }, "client", "session"]);
});
test("cancelled credentials never reach the API and can be retried", async () => {
  enroll.mock.mockImplementationOnce(async () => { throw new Error("Cancelled"); });
  await click();
  assert.equal(create.mock.callCount(), 0);
  await click();
  assert.equal(create.mock.callCount(), 1);
  assert.equal(error.mock.callCount(), 1);
});
test("API failures cannot start key synchronization", async () => {
  create.mock.mockImplementationOnce(async () => { throw new Error("Offline"); });
  await click();
  assert.equal(sync.mock.callCount(), 0);
  assert.equal(error.mock.callCount(), 1);
});
