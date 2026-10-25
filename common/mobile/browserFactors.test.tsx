// Verifies browser factor behavior is independent of viewport width and user agent.
// Owns real native-detection checks and browser enrollment/transport regressions.
// Does not launch a browser, wallet or credential provider.
import assert from "node:assert/strict";
import { after, before, mock, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { MetaMaskSDK } from "@metamask/sdk-react";

const nativeRequest = mock.fn(async () => { throw new Error("Browser called native bridge"); });
mock.module("./deviceBridge.ts", { namedExports: { requestDevice: nativeRequest } });
for (const form of ["AddMasterPassword", "AddMetamask", "AddPasskey"]) {
  mock.module(`../../components/app/factors/add/${form}.tsx`, { defaultExport: () => null });
}
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
after(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
  if (originalNavigator) Object.defineProperty(globalThis, "navigator", originalNavigator);
  else Reflect.deleteProperty(globalThis, "navigator");
});
let isMobileClient: typeof import("./useMobileClient").isMobileClient;
let wallet: typeof import("../factor/walletSdk");
let runFactorOperation: typeof import("./runFactorOperation").runFactorOperation;
let FactorChoice: typeof import("../../components/app/factors/FactorChoice").default;
before(async () => {
  ({ isMobileClient } = await import("./useMobileClient"));
  wallet = await import("../factor/walletSdk");
  ({ runFactorOperation } = await import("./runFactorOperation"));
  FactorChoice = (await import("../../components/app/factors/FactorChoice")).default;
});

for (const scenario of [
  { name: "desktop browser", width: 1440, userAgent: "Desktop browser" },
  { name: "desktop browser at phone width", width: 375, userAgent: "Desktop browser" },
  { name: "ordinary Android browser", width: 375, userAgent: "Mozilla/5.0 (Linux; Android 14) Mobile" },
]) {
  test(`${scenario.name} retains browser factor choices and never invokes native APIs`, async () => {
    nativeRequest.mock.resetCalls();
    Object.defineProperty(globalThis, "window", { configurable: true, value: {
      innerWidth: scenario.width, location: { href: "https://cipherwill.com/app/factors" },
    } });
    Object.defineProperty(globalThis, "navigator", { configurable: true, value: {
      userAgent: scenario.userAgent, credentials: { create() {}, get() {} },
    } });
    assert.equal(isMobileClient(), false);
    assert.deepEqual(wallet.getWalletSdkOptions(), {
      dappMetadata: { name: "Cipherwill", url: "https://cipherwill.com/app/factors" },
    });
    const html = renderToStaticMarkup(<FactorChoice continuous />);
    assert.match(html, /Master Password/);
    assert.match(html, /Metamask/);
    assert.match(html, />Passkey<\/button>/);
    assert.doesNotMatch(html, /disabled=""|Checking passkey support|does not support passkeys/);
    const sdk = { terminate: mock.fn() } as unknown as MetaMaskSDK;
    assert.equal(await wallet.requestWallet(sdk, async () => "browser-signature"), "browser-signature");
    assert.equal(await runFactorOperation(async () => "browser-migration"), "browser-migration");
    assert.equal(nativeRequest.mock.callCount(), 0);
  });
}

test("the native bridge selects app behavior even at desktop width", () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    innerWidth: 1440, location: { href: "https://cipherwill.com/app/factors" },
    CipherwillAuth: { postMessage() {} },
  } });
  assert.equal(isMobileClient(), true);
  assert.equal(wallet.getWalletSdkOptions().dappMetadata.scheme, "cipherwill-wallet");
  assert.equal(wallet.getWalletSdkOptions().useDeeplink, true);
});
