// Verifies unsupported native factors cannot prevent using a supported factor.
// Owns wallet/passkey notices and unchanged ordinary browser choices.
// Does not unlock vaults or launch credential providers.
import assert from "node:assert/strict";
import { after, before, mock, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
let mobile = true;
let passkeys: boolean | null = false;
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { href: "https://cipherwill.com/app" } } });
after(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});
mock.module("../../common/mobile/useMobileClient.ts", { namedExports: {
  useMobileClient: () => mobile, useMobilePasskeys: () => passkeys,
} });
mock.module("@metamask/sdk-react", { namedExports: { MetaMaskProvider: ({ children }: any) => <>{children}</> } });
mock.module("next/link", { defaultExport: ({ children }: any) => <>{children}</> });
mock.module("next/image", { defaultExport: () => null });
mock.module("./MasterPassword.tsx", { defaultExport: () => <button>Master password unlock</button> });
mock.module("./Passkey.tsx", { defaultExport: () => <button>Passkey unlock</button> });
mock.module("./Metamask.tsx", { defaultExport: () => <button>Wallet unlock</button> });
mock.module("./ResetFactor.tsx", { defaultExport: () => <button>Reset factors</button> });
// Next's asset loader is unnecessary for this component-only regression.
mock.module("../../assets/name-black.png", { defaultExport: "logo" });
mock.module("../../assets/name-white.png", { defaultExport: "logo" });
let Selection: typeof import("./SessionFactorSelection").default;
before(async () => { Selection = (await import("./SessionFactorSelection")).default; });
const methods = [{ id: "password", type: "master-password" }, { id: "wallet", type: "metamask" }, { id: "passkey", type: "passkey" }];
function renderSelection() { return renderToStaticMarkup(<Selection user={{ email: "test@example.test" }} logout={() => {}} methods={methods} set_session_token={() => {}} />); }
test("unsupported native wallet/passkey factors give desktop guidance while password remains usable", () => {
  const html = renderSelection();
  assert.match(html, /Master password unlock/);
  assert.match(html, /use your wallet factor/);
  assert.match(html, /unlock with this passkey/);
  assert.doesNotMatch(html, /Wallet unlock|Passkey unlock|<button>Reset factors/);
});
test("supported Android passkeys retain the web unlock action", () => {
  passkeys = true;
  assert.match(renderSelection(), /Passkey unlock/);
});
test("ordinary browser factor choices remain available", () => {
  mobile = false;
  assert.match(renderSelection(), /Wallet unlock/);
  assert.match(renderSelection(), /Reset factors/);
});
