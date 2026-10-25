// Exercises password unlocking through both existing and new factor versions.
// Owns session matching, legacy-password support, and failed or repeated submissions.
// Does not open a browser, migrate factors, or call an API.
import assert from "node:assert/strict";
import { before, beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { deriveMasterPasswordFactor } from "@/common/factor/masterPasswordFactor";

let password = "1234";
let click: () => Promise<void>;
let keyDown: (event: { key: string }) => Promise<void>;
const setSession = mock.fn();
const error = mock.fn();
mock.module("react", { defaultExport: React, namedExports: {
  ...React, useState: (initial: unknown) => [initial === "" ? password : initial, () => {}],
} });
mock.module("../../components/BasicPopup.tsx", { defaultExport: (props: { children: React.ReactElement<{ children: React.ReactNode }> }) => {
  const children = React.Children.toArray(props.children.props.children) as React.ReactElement<any>[];
  click = children.find(child => child.type === "button")!.props.onClick;
  keyDown = children.find(child => child.type === "input")!.props.onKeyDown;
  return props.children;
} });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error } });
let MasterPassword: typeof import("./MasterPassword").default;
before(async () => { MasterPassword = (await import("./MasterPassword")).default; });
beforeEach(() => {
  password = "1234";
  setSession.mock.resetCalls(); error.mock.resetCalls();
});

test("v1 and v2 start sessions with their original keys and do not modify stored factors", async () => {
  for (const nonce of ["123456", `v2:pbkdf2-sha256:600000:${"ab".repeat(16)}`]) {
    password = nonce === "123456" ? "1234" : "Abcdef1!";
    const factor = await deriveMasterPasswordFactor(password, nonce);
    const method = Object.freeze({ nonce, publicKey: factor.publicKey, name: "Password", type: "master-password" });
    renderToStaticMarkup(<MasterPassword method={method} set_session_token={setSession} />);
    await click();
    assert.deepEqual(setSession.mock.calls.at(-1)!.arguments[0], factor);
  }
  assert.equal(setSession.mock.callCount(), 2);
  assert.equal(error.mock.callCount(), 0);
});

test("Enter uses the same legacy-compatible unlock path", async () => {
  const factor = await deriveMasterPasswordFactor(password, "0");
  renderToStaticMarkup(<MasterPassword method={{ nonce: "0", publicKey: factor.publicKey }} set_session_token={setSession} />);
  await keyDown({ key: "Enter" });
  assert.deepEqual(setSession.mock.calls[0].arguments[0], factor);
});

test("wrong passwords cannot start sessions in either version", async () => {
  for (const nonce of ["123456", `v2:pbkdf2-sha256:600000:${"ab".repeat(16)}`]) {
    const factor = await deriveMasterPasswordFactor("Different1!", nonce);
    renderToStaticMarkup(<MasterPassword method={{ nonce, publicKey: factor.publicKey }} set_session_token={setSession} />);
    await click();
  }
  assert.equal(setSession.mock.callCount(), 0);
  assert.equal(error.mock.callCount(), 2);
  assert.equal(error.mock.calls[0].arguments[0], "Invalid password");
});

test("unknown versions and missing passwords cannot start sessions", async () => {
  renderToStaticMarkup(<MasterPassword method={{ nonce: "v3:123456", publicKey: "unused" }} set_session_token={setSession} />);
  await click();
  password = "";
  renderToStaticMarkup(<MasterPassword method={{ nonce: "123456", publicKey: "unused" }} set_session_token={setSession} />);
  await click();
  assert.equal(setSession.mock.callCount(), 0);
  assert.equal(error.mock.callCount(), 2);
});

test("repeated clicks during PBKDF2 produce only one session", async () => {
  password = "Abcdef1!";
  const nonce = `v2:pbkdf2-sha256:600000:${"ab".repeat(16)}`;
  const factor = await deriveMasterPasswordFactor(password, nonce);
  renderToStaticMarkup(<MasterPassword method={{ nonce, publicKey: factor.publicKey }} set_session_token={setSession} />);
  await Promise.all([click(), click()]);
  assert.equal(setSession.mock.callCount(), 1);
  assert.equal(error.mock.callCount(), 0);
});

test("a Web Crypto failure cannot unlock a v2 factor", async (t) => {
  t.mock.getter(globalThis, "crypto", () => undefined as unknown as Crypto);
  renderToStaticMarkup(<MasterPassword method={{ nonce: `v2:pbkdf2-sha256:600000:${"ab".repeat(16)}`, publicKey: "unused" }} set_session_token={setSession} />);
  await click();
  assert.equal(setSession.mock.callCount(), 0);
  assert.equal(error.mock.callCount(), 1);
});
