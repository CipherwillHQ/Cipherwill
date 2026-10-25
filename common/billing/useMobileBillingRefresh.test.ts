// Verifies returning from checkout reloads backend billing and account state.
// Owns native foreground subscriptions and browser isolation assertions.
// Does not activate Premium or contact the payment gateway.
import assert from "node:assert/strict";
import { afterEach, before, mock, test } from "node:test";
import React from "react";
import ME from "@/graphql/ops/auth/queries/ME";
import GET_MY_SUBSCRIPTION from "@/graphql/ops/app/billing/queries/GET_MY_SUBSCRIPTION";
const effects: (() => (() => void) | undefined)[] = [];
const refetch = mock.fn(async (_options: unknown) => []);
mock.module("react", { defaultExport: React, namedExports: {
  ...React, useEffect: (effect: () => (() => void) | undefined) => effects.push(effect),
} });
mock.module("@apollo/client/react", { namedExports: { useApolloClient: () => ({ refetchQueries: refetch }) } });
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
let useMobileBillingRefresh: typeof import("./useMobileBillingRefresh").default;
before(async () => { ({ default: useMobileBillingRefresh } = await import("./useMobileBillingRefresh")); });
afterEach(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
  effects.length = 0;
  refetch.mock.resetCalls();
});
test("returning to the native billing screen refreshes subscription and account queries", () => {
  const target = Object.assign(new EventTarget(), { CipherwillAuth: {} });
  Object.defineProperty(globalThis, "window", { configurable: true, value: target });
  useMobileBillingRefresh();
  const cleanup = effects[0]();
  target.dispatchEvent(new Event("cipherwill:foreground"));
  assert.deepEqual(refetch.mock.calls[0].arguments[0], { include: [ME, GET_MY_SUBSCRIPTION] });
  cleanup?.();
  target.dispatchEvent(new Event("cipherwill:foreground"));
  assert.equal(refetch.mock.callCount(), 1);
});
test("ordinary browsers keep their existing billing refresh behavior", () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: new EventTarget() });
  useMobileBillingRefresh();
  assert.equal(effects[0](), undefined);
  window.dispatchEvent(new Event("cipherwill:foreground"));
  assert.equal(refetch.mock.callCount(), 0);
});
