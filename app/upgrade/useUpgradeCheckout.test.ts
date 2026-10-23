// Verifies public checkout attribution and payment lifecycle behavior.
// Owns coverage for invalid links, SDK failures, cancellation, and completion.
// Does not open a browser, authenticate a user, or charge a payment method.
import assert from "node:assert/strict";
import { after, before, beforeEach, mock, test } from "node:test";
import React from "react";
import { CheckoutEventNames, type Paddle, type PaddleSetupOptions } from "@paddle/paddle-js";

const account = { email: "user+mobile@example.com", userId: "user_mobile_account" };
const effects: Array<() => (() => void) | undefined> = [];
const postMessage = mock.fn<(message: string) => void>();
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
let state: unknown[] = [];
let stateIndex = 0;
let options: PaddleSetupOptions;
const open = mock.fn<(checkout: unknown) => void>();
const instance = { Checkout: { open } } as unknown as Paddle;
const initialize = mock.fn(async (config: PaddleSetupOptions): Promise<Paddle | undefined> => {
  options = config;
  return instance;
});

mock.module("react", { defaultExport: React, namedExports: {
  ...React,
  useEffect: (effect: () => (() => void) | undefined) => effects.push(effect),
  useRef: (initial: unknown) => {
    const index = stateIndex++;
    if (state[index] === undefined) state[index] = { current: initial };
    return state[index];
  },
  useState: (initial: unknown) => {
    const index = stateIndex++;
    if (state[index] === undefined) state[index] = initial;
    return [state[index], (value: unknown) => { state[index] = value; }];
  },
} });
mock.module("@paddle/paddle-js", { namedExports: { initializePaddle: initialize } });
mock.module("../../common/billing/paddleConfig.ts", { namedExports: {
  PADDLE_ENVIRONMENT: "sandbox", PADDLE_TOKEN: "test-token", PADDLE_YEARLY_PRICE_ID: "pri_test_annual",
} });

let useUpgradeCheckout: typeof import("./useUpgradeCheckout").default;
before(async () => { ({ default: useUpgradeCheckout } = await import("./useUpgradeCheckout")); });
after(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

function renderCheckout(props = account) {
  stateIndex = 0;
  // This harness calls mocked hooks to inspect state without mounting a browser.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useUpgradeCheckout(props);
}

async function loadCheckout() {
  const initial = renderCheckout();
  assert.equal(initial.loading, true);
  effects[0]();
  await new Promise((resolve) => setImmediate(resolve));
  return renderCheckout();
}

beforeEach(() => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: { CipherwillUpgrade: { postMessage } } });
  postMessage.mock.resetCalls();
  state = [];
  stateIndex = 0;
  effects.length = 0;
  open.mock.resetCalls();
  open.mock.mockImplementation(() => {});
  initialize.mock.resetCalls();
  initialize.mock.mockImplementation(async (config) => { options = config; return instance; });
});

test("opens an annual checkout with the mobile account ID and billing email, without a login", async () => {
  const checkout = await loadCheckout();
  assert.equal(checkout.canCheckout, true);
  assert.equal(checkout.completed, false);
  assert.equal(options.token, "test-token");
  checkout.openCheckout();
  const config = open.mock.calls[0].arguments[0] as Record<string, unknown>;
  assert.deepEqual(config.items, [{ priceId: "pri_test_annual", quantity: 1 }]);
  assert.deepEqual(config.customer, { email: account.email });
  assert.deepEqual(config.customData, { user_id: account.userId });
  assert.deepEqual(config.settings, {
    displayMode: "overlay", theme: "light", allowLogout: false,
    allowedPaymentMethods: ["apple_pay", "google_pay", "paypal", "card"],
  });
  assert.equal(renderCheckout().canCheckout, false);
  renderCheckout().openCheckout();
  assert.equal(open.mock.callCount(), 1);
});

for (const props of [
  { ...account, userId: "" }, { ...account, email: "" }, { ...account, email: "invalid-email" },
]) {
  test(`rejects incomplete or invalid links: ${JSON.stringify(props)}`, () => {
    const checkout = renderCheckout(props);
    effects[0]();
    checkout.openCheckout();
    assert.equal(checkout.hasValidLink, false);
    assert.equal(checkout.canCheckout, false);
    assert.equal(checkout.loading, false);
    assert.equal(initialize.mock.callCount(), 0);
    assert.equal(open.mock.callCount(), 0);
    assert.equal(JSON.parse(postMessage.mock.calls[0].arguments[0]).code, "invalid_link");
  });
}

test("keeps cancellation on the public upgrade screen and allows another attempt", async () => {
  (await loadCheckout()).openCheckout();
  options.eventCallback?.({ name: CheckoutEventNames.CHECKOUT_CLOSED });
  const checkout = renderCheckout();
  assert.equal(checkout.completed, false);
  assert.equal(checkout.canCheckout, true);
  assert.equal(postMessage.mock.callCount(), 0);
});

test("shows completion only after Paddle confirms it, without redirecting to authenticated billing", async () => {
  (await loadCheckout()).openCheckout();
  assert.equal(renderCheckout().completed, false);
  options.eventCallback?.({ name: CheckoutEventNames.CHECKOUT_COMPLETED });
  const checkout = renderCheckout();
  assert.equal(checkout.completed, true);
  assert.equal(checkout.checkoutOpen, false);
  assert.equal(checkout.canCheckout, false);
  checkout.openCheckout();
  assert.equal(open.mock.callCount(), 1);
  assert.deepEqual(JSON.parse(postMessage.mock.calls[0].arguments[0]), { type: "cipherwill.upgrade", status: "success" });
  options.eventCallback?.({ name: CheckoutEventNames.CHECKOUT_COMPLETED });
  assert.equal(postMessage.mock.callCount(), 1);
});

test("reports initialization rejection and keeps checkout disabled", async () => {
  initialize.mock.mockImplementation(async () => { throw new Error("SDK unavailable"); });
  const checkout = await loadCheckout();
  assert.match(checkout.error!, /unavailable/);
  assert.equal(checkout.loading, false);
  assert.equal(checkout.canCheckout, false);
  assert.equal(JSON.parse(postMessage.mock.calls[0].arguments[0]).code, "initialization_failed");
});

test("reports a missing SDK instance and keeps checkout disabled", async () => {
  initialize.mock.mockImplementation(async () => undefined);
  const checkout = await loadCheckout();
  assert.match(checkout.error!, /unavailable/);
  assert.equal(checkout.canCheckout, false);
  assert.equal(JSON.parse(postMessage.mock.calls[0].arguments[0]).code, "initialization_failed");
});

for (const event of [CheckoutEventNames.CHECKOUT_ERROR, CheckoutEventNames.CHECKOUT_FAILED,
  CheckoutEventNames.CHECKOUT_PAYMENT_ERROR, CheckoutEventNames.CHECKOUT_PAYMENT_FAILED]) {
  test(`notifies Flutter about ${event} without reporting a completed payment`, async () => {
    (await loadCheckout()).openCheckout();
    options.eventCallback?.({ name: event });
    const checkout = renderCheckout();
    assert.match(checkout.error!, /try again/);
    assert.equal(checkout.completed, false);
    assert.equal(checkout.canCheckout, true);
    assert.equal(JSON.parse(postMessage.mock.calls[0].arguments[0]).status, "error");
    assert.equal(JSON.parse(postMessage.mock.calls[0].arguments[0]).code, event);
    checkout.openCheckout();
    assert.equal(renderCheckout().error, null);
    options.eventCallback?.({ name: CheckoutEventNames.CHECKOUT_COMPLETED });
    assert.equal(postMessage.mock.callCount(), 2);
    assert.equal(JSON.parse(postMessage.mock.calls[1].arguments[0]).status, "success");
  });
}

test("reports checkout opening failures and allows another attempt", async () => {
  const checkout = await loadCheckout();
  open.mock.mockImplementation(() => { throw new Error("Checkout failed"); });
  checkout.openCheckout();
  assert.match(renderCheckout().error!, /could not be opened/);
  assert.equal(renderCheckout().canCheckout, true);
  assert.equal(JSON.parse(postMessage.mock.calls[0].arguments[0]).code, "checkout_open_failed");
});

test("ignores Paddle events after the upgrade screen unmounts", async () => {
  await loadCheckout();
  const cleanup = effects[0]();
  cleanup?.();
  options.eventCallback?.({ name: CheckoutEventNames.CHECKOUT_COMPLETED });
  assert.equal(renderCheckout().completed, false);
  assert.equal(postMessage.mock.callCount(), 0);
});
