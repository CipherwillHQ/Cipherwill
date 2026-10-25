// Verifies mobile wallet handoff and request recovery without a real wallet.
// Owns native launch, failure, timeout and unchanged browser behavior.
// Does not send signatures or account credentials outside the test process.
import assert from "node:assert/strict";
import { after, before, beforeEach, mock, test } from "node:test";
import type { MetaMaskSDK } from "@metamask/sdk-react";
let mobile = true;
const launch = mock.fn(async (_type: string, _payload: unknown) => undefined);
const terminate = mock.fn(async () => {});
const sdk = { terminate } as unknown as MetaMaskSDK;
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { href: "https://cipherwill.com/app/factors" } } });
after(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});
mock.module("../auth/mobileAuthBridge.ts", { namedExports: { getMobileAuthBridge: () => mobile ? {} : undefined } });
mock.module("../mobile/deviceBridge.ts", { namedExports: { requestDevice: launch } });
let wallet: typeof import("./walletSdk");
before(async () => { wallet = await import("./walletSdk"); });
beforeEach(() => {
  mobile = true;
  launch.mock.resetCalls(); terminate.mock.resetCalls();
  launch.mock.mockImplementation(async () => undefined);
});

test("native options use the dedicated return scheme and send only the SDK connection URL", async () => {
  const options = wallet.getWalletSdkOptions();
  assert.equal(options.dappMetadata.scheme, "cipherwill-wallet");
  assert.equal(options.useDeeplink, true);
  assert.equal(options.preferDesktop, false);
  const signature = await wallet.requestWallet(sdk, async () => {
    options.openDeeplink!("metamask://connect?channelId=test");
    return "signature-over-sdk";
  });
  assert.equal(signature, "signature-over-sdk");
  assert.deepEqual(launch.mock.calls[0].arguments, ["wallet-open", { url: "metamask://connect?channelId=test" }]);
  assert.equal(terminate.mock.callCount(), 0);
});

test("a missing wallet rejects the pending SDK request and permits retry", async () => {
  launch.mock.mockImplementationOnce(async () => { throw new Error("Not installed"); });
  await assert.rejects(wallet.requestWallet(sdk, () => {
    wallet.openWalletDeeplink("metamask://connect?channelId=test");
    return new Promise(() => {});
  }), /Install or update MetaMask/);
  assert.equal(terminate.mock.callCount(), 1);
  assert.deepEqual(await wallet.requestWallet(sdk, async () => ["0x123"]), ["0x123"]);
});

test("requests time out without leaving a permanent busy SDK session", async (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const result = assert.rejects(wallet.requestWallet(sdk, () => new Promise(() => {})), /did not respond/);
  context.mock.timers.tick(120000);
  await result;
  assert.equal(terminate.mock.callCount(), 1);
});

test("wallet rejection propagates and clears mobile request state", async () => {
  await assert.rejects(wallet.requestWallet(sdk, async () => { throw new Error("User rejected request"); }), /User rejected/);
  assert.equal(terminate.mock.callCount(), 1);
});

test("a late launch failure from an earlier request cannot cancel a new request", async () => {
  let rejectLaunch!: (error: Error) => void;
  launch.mock.mockImplementationOnce(() => new Promise((_, reject) => { rejectLaunch = reject; }));
  await wallet.requestWallet(sdk, async () => {
    wallet.openWalletDeeplink("metamask://connect?channelId=old");
    return "old-result";
  });
  const result = await wallet.requestWallet(sdk, async () => {
    rejectLaunch(new Error("Delayed bridge failure"));
    await new Promise((resolve) => setImmediate(resolve));
    return "new-result";
  });
  assert.equal(result, "new-result");
  assert.equal(terminate.mock.callCount(), 0);
});

test("desktop keeps the browser SDK transport and never invokes the native bridge", async () => {
  mobile = false;
  assert.equal(wallet.getWalletSdkOptions().openDeeplink, undefined);
  assert.equal(wallet.getWalletSdkOptions().dappMetadata.scheme, undefined);
  assert.equal(await wallet.requestWallet(sdk, async () => "browser-signature"), "browser-signature");
  assert.equal(launch.mock.callCount(), 0);
});
