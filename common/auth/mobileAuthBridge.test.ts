// Verifies bridge delivery, request matching and disconnected native channels.
// Owns the small WebView message contract and browser fallback tests.
// Does not authenticate accounts or open a browser.
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import type { MobileAuthWindow } from "@/types/interfaces";
import { getMobileAuthBridge, receiveMobileAuth, requestMobileAuth } from "./mobileAuthBridge";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
afterEach(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});
test("ordinary browsers do not request native authentication", async () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  assert.equal(getMobileAuthBridge(), undefined);
  assert.equal(await requestMobileAuth("session"), null);
});
test("out-of-order responses resolve only their matching native requests", async () => {
  const requests: { id: number }[] = [];
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    CipherwillAuth: { postMessage: (message: string) => requests.push(JSON.parse(message)) },
  } });
  const first = requestMobileAuth("session");
  const second = requestMobileAuth("session");
  const session = { uid: "native-user", idToken: "native-token" };
  receiveMobileAuth(requests[1].id, null);
  receiveMobileAuth(requests[0].id, session);
  assert.equal(await first, session);
  assert.equal(await second, null);
});
test("a disconnected native channel completes without retaining a pending request", async () => {
  const target = { CipherwillAuth: { postMessage: () => { throw Error("Disconnected"); } } } as unknown as MobileAuthWindow;
  Object.defineProperty(globalThis, "window", { configurable: true, value: target });
  assert.equal(await requestMobileAuth("session"), null);
});
