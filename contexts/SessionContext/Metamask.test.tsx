// Exercises legacy and v2 wallet unlocking against stored public keys.
// Owns message selection and rejection of mismatched or unsupported factors.
// Does not open a browser, migrate factors, or contact a wallet.
import assert from "node:assert/strict";
import { before, beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { deriveMetamaskFactor, getMetamaskSigningMessage } from "@/common/factor/metamaskFactor";

const signature = `0x${"11".repeat(64)}1b`;
const sign = mock.fn(async (_request: { msg: string }): Promise<unknown> => signature);
const setSession = mock.fn();
const error = mock.fn();
let click: () => Promise<void>;

mock.module("react", { defaultExport: React, namedExports: {
  ...React, useState: () => ["0x1234567890abcdef", () => {}],
} });
mock.module("@metamask/sdk-react", { namedExports: { useSDK: () => ({ sdk: { connectAndSign: sign } }) } });
mock.module("../../components/common/SimpleButton.tsx", { defaultExport: (props: { onClick: typeof click; children: React.ReactNode }) => {
  click = props.onClick;
  return <button>{props.children}</button>;
} });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error } });
let Metamask: typeof import("./Metamask").default;
before(async () => { Metamask = (await import("./Metamask")).default; });
beforeEach(() => {
  sign.mock.resetCalls(); setSession.mock.resetCalls(); error.mock.resetCalls();
  sign.mock.mockImplementation(async () => signature);
});

test("v1 and v2 unlock through their own signing message without changing the factor", async () => {
  for (const nonce of ["123456", `v2:${"ab".repeat(32)}`]) {
    const derived = deriveMetamaskFactor(signature, nonce);
    const method = Object.freeze({ nonce, publicKey: derived.publicKey, name: "Wallet", type: "metamask" });
    renderToStaticMarkup(<Metamask method={method} set_session_token={setSession} />);
    await click();
    assert.deepEqual(sign.mock.calls.at(-1)!.arguments[0], { msg: getMetamaskSigningMessage(nonce) });
    assert.deepEqual(setSession.mock.calls.at(-1)!.arguments[0], derived);
  }
  assert.equal(setSession.mock.callCount(), 2);
  assert.equal(error.mock.callCount(), 0);
});

test("a mismatched public key never starts a session", async () => {
  renderToStaticMarkup(<Metamask method={{ nonce: `v2:${"ab".repeat(32)}`, publicKey: "wrong-public-key" }} set_session_token={setSession} />);
  await click();
  assert.equal(setSession.mock.callCount(), 0);
  assert.equal(error.mock.calls[0].arguments[0], "Invalid wallet");
});

test("unsupported versions are rejected before requesting a signature", async () => {
  renderToStaticMarkup(<Metamask method={{ nonce: `v3:${"ab".repeat(32)}`, publicKey: "unused" }} set_session_token={setSession} />);
  await click();
  assert.equal(sign.mock.callCount(), 0);
  assert.equal(setSession.mock.callCount(), 0);
  assert.equal(error.mock.callCount(), 1);
});

test("failed signing never starts a session", async () => {
  sign.mock.mockImplementationOnce(async () => { throw new Error("User rejected request"); });
  renderToStaticMarkup(<Metamask method={{ nonce: "123456", publicKey: "unused" }} set_session_token={setSession} />);
  await click();
  assert.equal(setSession.mock.callCount(), 0);
  assert.equal(error.mock.callCount(), 1);
});
