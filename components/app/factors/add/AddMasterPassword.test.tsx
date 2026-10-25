// Exercises new password-factor creation through the existing API contract.
// Owns password policy, v2 metadata, secret isolation, and submission failures.
// Does not open a browser, contact services, or migrate existing factors.
import assert from "node:assert/strict";
import { after, before, beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { deriveMasterPasswordFactor, MASTER_PASSWORD_REQUIREMENTS } from "@/common/factor/masterPasswordFactor";

let password = "Abcdef1!";
let click: () => Promise<void>;
const createFactor = mock.fn(async (_request: { variables: Record<string, string> }) => ({}));
const error = mock.fn();
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { reload: mock.fn() } } });
after(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});
mock.module("react", { defaultExport: React, namedExports: {
  ...React, useState: (initial: unknown) => [initial === "" ? password : initial, () => {}],
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
let AddMasterPassword: typeof import("./AddMasterPassword").default;
before(async () => { AddMasterPassword = (await import("./AddMasterPassword")).default; });
beforeEach(() => {
  password = "Abcdef1!";
  createFactor.mock.resetCalls(); error.mock.resetCalls();
  createFactor.mock.mockImplementation(async () => ({}));
});

test("an eight-character password with number and symbol creates only public v2 factor fields", async () => {
  renderToStaticMarkup(<AddMasterPassword continuous={false} />);
  await click();
  assert.equal(createFactor.mock.callCount(), 1);
  const { variables } = createFactor.mock.calls[0].arguments[0];
  assert.match(variables.nonce, /^v2:pbkdf2-sha256:600000:[0-9a-f]{32}$/);
  const factor = await deriveMasterPasswordFactor(password, variables.nonce);
  assert.equal(variables.publicKey, factor.publicKey);
  assert.equal(variables.type, "master-password");
  assert.deepEqual(Object.keys(variables).sort(), ["name", "nonce", "publicKey", "type"]);
  assert.ok(!JSON.stringify(variables).includes(password));
  assert.ok(!JSON.stringify(variables).includes(factor.privateKey));
});

test("too-short passwords and passwords without a number or symbol never reach the API", async () => {
  for (const invalid of ["", "1234", "Abcde1!", "Abcdefgh!", "Abcdefg1", "Abcdefg1 "]) {
    password = invalid;
    renderToStaticMarkup(<AddMasterPassword continuous={false} />);
    await click();
  }
  assert.equal(createFactor.mock.callCount(), 0);
  assert.equal(error.mock.callCount(), 6);
  assert.equal(error.mock.calls[0].arguments[0], MASTER_PASSWORD_REQUIREMENTS);
});

test("repeated clicks during derivation create a single factor", async () => {
  renderToStaticMarkup(<AddMasterPassword continuous={false} />);
  await Promise.all([click(), click()]);
  assert.equal(createFactor.mock.callCount(), 1);
});

test("missing Web Crypto cannot fall back to creating a legacy factor", async (t) => {
  t.mock.getter(globalThis, "crypto", () => undefined as unknown as Crypto);
  renderToStaticMarkup(<AddMasterPassword continuous={false} />);
  await click();
  assert.equal(createFactor.mock.callCount(), 0);
  assert.equal(error.mock.callCount(), 1);
});

test("failed API calls release the submission guard for a safe retry", async () => {
  createFactor.mock.mockImplementationOnce(async () => { throw new Error("Synthetic API failure"); });
  renderToStaticMarkup(<AddMasterPassword continuous={false} />);
  await click();
  await click();
  assert.equal(createFactor.mock.callCount(), 2);
  assert.equal(error.mock.callCount(), 1);
});
