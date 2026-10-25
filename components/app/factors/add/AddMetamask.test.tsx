// Exercises wallet-factor creation with a mocked SDK and API.
// Owns v2 creation, secret isolation, and cancelled-signing regressions.
// Does not open a browser, contact a wallet, or migrate existing data.
import assert from "node:assert/strict";
import { after, before, beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { deriveMetamaskFactor, getMetamaskSigningMessage } from "@/common/factor/metamaskFactor";

const signature = `0x${"11".repeat(64)}1b`;
const sign = mock.fn(async (_request: { msg: string }): Promise<unknown> => signature);
const createFactor = mock.fn(async (_request: { variables: Record<string, string> }) => ({}));
const error = mock.fn();
let click: () => Promise<void>;
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
Object.defineProperty(globalThis, "window", { configurable: true, value: {
  location: { href: "https://cipherwill.com/app", reload: mock.fn() },
} });
after(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

mock.module("react", { defaultExport: React, namedExports: {
  ...React, useState: (initial: unknown) => [initial === undefined ? "0x1234567890abcdef" : initial, () => {}],
} });
mock.module("@metamask/sdk-react", { namedExports: {
  MetaMaskProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSDK: () => ({ sdk: { connectAndSign: sign } }),
} });
mock.module("@apollo/client/react", { namedExports: {
  useApolloClient: () => ({}), useMutation: () => [createFactor, { loading: false }],
} });
mock.module("../../../../contexts/SessionContext/index.tsx", { namedExports: { useSession: () => ({ session: null }) } });
mock.module("./continuousFactorIn.ts", { defaultExport: mock.fn() });
mock.module("../../../common/SimpleButton.tsx", { defaultExport: (props: { onClick: typeof click; children: React.ReactNode }) => {
  click = props.onClick;
  return <button>{props.children}</button>;
} });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error, success: mock.fn() } });
let AddMetamask: typeof import("./AddMetamask").default;
before(async () => { AddMetamask = (await import("./AddMetamask")).default; });
beforeEach(() => {
  sign.mock.resetCalls(); createFactor.mock.resetCalls(); error.mock.resetCalls();
  sign.mock.mockImplementation(async () => signature);
  renderToStaticMarkup(<AddMetamask continuous={false} />);
});

test("new wallet factors sign the v2 message and send only public factor fields", async () => {
  await click();
  assert.equal(createFactor.mock.callCount(), 1);
  const { variables } = createFactor.mock.calls[0].arguments[0];
  assert.match(variables.nonce, /^v2:[0-9a-f]{64}$/);
  assert.deepEqual(sign.mock.calls[0].arguments[0], { msg: getMetamaskSigningMessage(variables.nonce) });
  const derived = deriveMetamaskFactor(signature, variables.nonce);
  assert.equal(variables.publicKey, derived.publicKey);
  assert.equal(variables.type, "metamask");
  assert.deepEqual(Object.keys(variables).sort(), ["name", "nonce", "publicKey", "type"]);
  assert.ok(!JSON.stringify(variables).includes(signature));
  assert.ok(!JSON.stringify(variables).includes(derived.privateKey));
});

test("cancelled or malformed wallet signatures cannot create a factor", async () => {
  sign.mock.mockImplementationOnce(async () => { throw new Error("User rejected request"); });
  await click();
  sign.mock.mockImplementationOnce(async () => undefined);
  await click();
  assert.equal(createFactor.mock.callCount(), 0);
  assert.equal(error.mock.callCount(), 2);
});
