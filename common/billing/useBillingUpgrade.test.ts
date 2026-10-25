// Verifies external upgrades use the backend account and preserve browser checkout.
// Owns URL attribution, encoding and missing-account regressions.
// Does not open a browser or charge a payment method.
import assert from "node:assert/strict";
import { after, before, beforeEach, mock, test } from "node:test";
import React from "react";
const assign = mock.fn<(url: string) => void>();
const open = mock.fn<(config: unknown) => void>();
const error = mock.fn();
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
let account: { id: string; email: string } | undefined;
let paddle: { Checkout: { open: typeof open } } | undefined;
let user: { email: string } | undefined;
mock.module("react", { defaultExport: React, namedExports: {
  ...React, useCallback: (callback: () => void) => callback,
} });
mock.module("@apollo/client/react", { namedExports: { useQuery: () => ({ data: { me: account } }) } });
mock.module("../../contexts/UserSetupContext/index.tsx", { namedExports: { useUserContext: () => ({ user }) } });
mock.module("../../contexts/PaymentGatewayContext.tsx", { namedExports: {
  usePaddle: () => ({ paddle, PADDLE_YEARLY_PRICE_ID: "pri_annual" }),
} });
mock.module("react-hot-toast", { defaultExport: { error } });
mock.module("../debug/logger.ts", { defaultExport: { error } });
let useBillingUpgrade: typeof import("./useBillingUpgrade").default;
before(async () => { ({ default: useBillingUpgrade } = await import("./useBillingUpgrade")); });
after(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});
beforeEach(() => {
  assign.mock.resetCalls();
  open.mock.resetCalls();
  error.mock.resetCalls();
  account = { id: "database_account/with+chars", email: "owner+mobile@example.com" };
  user = { email: "owner+desktop@example.com" };
  paddle = { Checkout: { open } };
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    location: { assign }, CipherwillAuth: { uid: "firebase_uid", idToken: "private-token" },
  } });
});
test("mobile opens the public upgrade URL with encoded database ID and email without Paddle", () => {
  paddle = undefined;
  useBillingUpgrade()();
  const url = new URL(assign.mock.calls[0].arguments[0]);
  assert.equal(url.origin, "https://cipherwill.com");
  assert.equal(url.pathname, "/upgrade");
  assert.equal(url.searchParams.get("email"), account!.email);
  assert.equal(url.searchParams.get("user_id"), account!.id);
  assert.deepEqual([...url.searchParams.keys()], ["email", "user_id"]);
  assert.doesNotMatch(url.href, /firebase_uid|private-token/);
  assert.equal(open.mock.callCount(), 0);
});
test("ordinary browsers retain annual Paddle checkout options and customer details", () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { assign } } });
  useBillingUpgrade()();
  assert.deepEqual(open.mock.calls[0].arguments[0], {
    settings: {
      successUrl: "https://www.cipherwill.com/callback/checkout_success",
      allowedPaymentMethods: ["apple_pay", "google_pay", "paypal", "card"], theme: "dark",
    },
    items: [{ priceId: "pri_annual", quantity: 1 }],
    customData: { user_id: account!.id }, customer: { email: user!.email },
  });
  assert.equal(assign.mock.callCount(), 0);
});
test("browser checkout still works without a prefilled customer", () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  user = undefined;
  useBillingUpgrade()();
  assert.ok(!("customer" in (open.mock.calls[0].arguments[0] as object)));
});
test("missing backend account details prevent an unattributed upgrade", () => {
  account = undefined;
  useBillingUpgrade()();
  assert.equal(assign.mock.callCount(), 0);
  assert.equal(open.mock.callCount(), 0);
  assert.ok(error.mock.callCount() > 0);
});
