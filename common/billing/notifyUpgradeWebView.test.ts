// Verifies the Flutter checkout bridge's delivery and fallback behavior.
// Owns coverage for result messages, duplicate events, and disconnected channels.
// Does not open a WebView or communicate with a real mobile client.
import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import notifyUpgradeWebView from "./notifyUpgradeWebView";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

afterEach(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

function installChannel(postMessage: (message: string) => void) {
  Object.defineProperty(globalThis, "window", {
    configurable: true, value: { CipherwillUpgrade: { postMessage } },
  });
}

test("sends a JSON success message without account or billing details", () => {
  const postMessage = mock.fn();
  installChannel(postMessage);
  const sent = { current: false };
  notifyUpgradeWebView({ status: "success" }, sent);
  assert.deepEqual(JSON.parse(postMessage.mock.calls[0].arguments[0]), {
    type: "cipherwill.upgrade", status: "success",
  });
  assert.equal(sent.current, true);
});

test("sends an error message that Flutter can display when closing the WebView", () => {
  const postMessage = mock.fn();
  installChannel(postMessage);
  notifyUpgradeWebView({ status: "error", code: "checkout.payment.failed", message: "Please try again." }, { current: false });
  assert.deepEqual(JSON.parse(postMessage.mock.calls[0].arguments[0]), {
    type: "cipherwill.upgrade", status: "error", code: "checkout.payment.failed", message: "Please try again.",
  });
});

test("delivers only one terminal result per checkout attempt", () => {
  const postMessage = mock.fn();
  installChannel(postMessage);
  const sent = { current: false };
  notifyUpgradeWebView({ status: "success" }, sent);
  notifyUpgradeWebView({ status: "success" }, sent);
  notifyUpgradeWebView({ status: "error" }, sent);
  assert.equal(postMessage.mock.callCount(), 1);
});

test("allows a fresh result when another checkout attempt starts", () => {
  const postMessage = mock.fn();
  installChannel(postMessage);
  const sent = { current: false };
  notifyUpgradeWebView({ status: "error" }, sent);
  sent.current = false;
  notifyUpgradeWebView({ status: "success" }, sent);
  assert.equal(postMessage.mock.callCount(), 2);
});

test("leaves server rendering and ordinary browser checkout working without a channel", () => {
  const sent = { current: false };
  Reflect.deleteProperty(globalThis, "window");
  assert.doesNotThrow(() => notifyUpgradeWebView({ status: "success" }, sent));
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  assert.doesNotThrow(() => notifyUpgradeWebView({ status: "success" }, sent));
  assert.equal(sent.current, false);
});

test("does not break checkout or mark delivery when the native channel throws", () => {
  installChannel(() => { throw new Error("WebView was closed"); });
  const sent = { current: false };
  assert.doesNotThrow(() => notifyUpgradeWebView({ status: "error" }, sent));
  assert.equal(sent.current, false);
});
