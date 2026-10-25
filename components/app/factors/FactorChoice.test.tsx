// Verifies Android enrollment exposes all supported factor types.
// Owns loading and unavailable-passkey guidance without blocking other factors.
// Does not register credentials or connect a wallet.
import assert from "node:assert/strict";
import { before, mock, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
let passkeys: boolean | null = true;
mock.module("../../../common/mobile/useMobileClient.ts", { namedExports: {
  useMobileClient: () => true, useMobilePasskeys: () => passkeys,
} });
for (const form of ["AddMasterPassword", "AddMetamask", "AddPasskey"]) {
  mock.module(`./add/${form}.tsx`, { defaultExport: () => null });
}
let FactorChoice: typeof import("./FactorChoice").default;
before(async () => { FactorChoice = (await import("./FactorChoice")).default; });
test("capable Android devices can choose all three factors", () => {
  const html = renderToStaticMarkup(<FactorChoice continuous />);
  assert.match(html, /Master Password/);
  assert.match(html, /Metamask/);
  assert.match(html, />Passkey<\/button>/);
  assert.doesNotMatch(html, /disabled=""/);
});
test("pending and unavailable passkeys leave password and wallet choices enabled", () => {
  for (const support of [null, false]) {
    passkeys = support;
    const html = renderToStaticMarkup(<FactorChoice continuous />);
    assert.equal((html.match(/disabled=""/g) || []).length, 1);
    assert.match(html, support === null ? /Checking passkey support/ : /does not support passkeys/);
    assert.doesNotMatch(html, /Please sign in on desktop/);
  }
});
