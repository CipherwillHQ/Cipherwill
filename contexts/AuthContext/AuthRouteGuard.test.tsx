// Tests email verification at the executor dashboard entry point.
// Owns executor redirects and continued access to ordinary app and verification pages.
// Does not open a browser or contact authentication services.
import assert from "node:assert/strict";
import { before, beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import React from "react";

const replace = mock.fn();
mock.module("react", { defaultExport: React, namedExports: { ...React, useEffect: (effect: () => void) => effect() } });
mock.module(pathToFileURL(require.resolve("next/navigation")), { namedExports: { useRouter: () => ({ replace }) } });
let AuthRouteGuard: typeof import("./AuthRouteGuard").AuthRouteGuard;
before(async () => { ({ AuthRouteGuard } = await import("./AuthRouteGuard")); });
beforeEach(() => replace.mock.resetCalls());
const user = { uid: "firebase-user", email: "beneficiary@example.com", emailVerified: false };

test("unverified users cannot mount an executor page", () => {
  const page = AuthRouteGuard({ isPrivateRoute: true, isLoading: false, user,
    pathname: "/executor/shared-will", children: "inherited content" });
  assert.equal(page, null);
  assert.equal(replace.mock.calls[0]?.arguments[0], "/auth/verify-email?redirect=%2Fexecutor%2Fshared-will");
});

test("verified users can enter the executor dashboard", () => {
  const page = AuthRouteGuard({ isPrivateRoute: true, isLoading: false, user: { ...user, emailVerified: true },
    pathname: "/executor", children: "inherited content" });
  assert.equal(page?.props.children, "inherited content");
  assert.equal(replace.mock.callCount(), 0);
});

test("ordinary app pages remain available to unverified users", () => {
  const page = AuthRouteGuard({ isPrivateRoute: true, isLoading: false, user,
    pathname: "/app", children: "ordinary account" });
  assert.equal(page?.props.children, "ordinary account");
  assert.equal(replace.mock.callCount(), 0);
});

test("the public verification page remains reachable", () => {
  const page = AuthRouteGuard({ isPrivateRoute: false, isLoading: false, user,
    pathname: "/auth/verify-email", children: "verification" });
  assert.equal(page?.props.children, "verification");
  assert.equal(replace.mock.callCount(), 0);
});
