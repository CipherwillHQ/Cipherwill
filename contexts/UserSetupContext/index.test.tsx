// What it does: Reproduces signup overcounting during repeated account setup.
// What it owns: Country initialization and analytics regressions with mocked services.
// What it does NOT do: Open a browser, authenticate users, or contact production.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import React from "react";

const effects: Array<() => void> = [];
const posthog = { identify: mock.fn(), capture: mock.fn() };
const googleConversion = mock.fn();
const setupCountry = mock.fn(async () => ({}));
const profile = { id: "user_existing", country: null, created_at: "1700000000000" };
Object.defineProperty(globalThis, "window", {
  configurable: true, value: { GoogleConverted: googleConversion },
});

mock.module("react", { defaultExport: React, namedExports: {
  ...React,
  useCallback: (callback: unknown) => callback,
  useEffect: (effect: () => void) => effects.push(effect),
  useContext: mock.fn(),
} });
mock.module("../AuthContext/index.tsx", { namedExports: {
  useAuth: () => ({ user: { uid: "firebase_existing", email: "test@example.com" } }),
} });
mock.module("@apollo/client/react", { namedExports: {
  useQuery: () => ({ data: { me: profile }, loading: false }),
  useLazyQuery: () => [mock.fn(), { loading: false }],
  useMutation: () => [setupCountry],
} });
mock.module(pathToFileURL(require.resolve("posthog-js/react")), { namedExports: { usePostHog: () => posthog } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { success: mock.fn() } });
mock.module("../../common/debug/logger.ts", { defaultExport: { error: mock.fn() } });
mock.module("../../common/country/getLocalCountry.ts", { defaultExport: () => "IN" });
mock.module("../../common/country/getCountryNameByCode.ts", { defaultExport: () => "India" });
mock.module("../../graphql/ops/auth/queries/ME.ts", { defaultExport: "ME" });
mock.module("../../graphql/ops/auth/queries/GET_PREFERENCES.ts", { defaultExport: "GET_PREFERENCES" });
mock.module("../../graphql/ops/auth/mutations/UPDATE_USER.ts", { defaultExport: "UPDATE_USER" });

test("repeated setup with an empty country never records a new signup", async () => {
  const { UserSetupProvider } = await import("./index");
  UserSetupProvider({});
  for (const effect of effects) {
    effect();
    effect();
  }
  await Promise.resolve();
  assert.equal(setupCountry.mock.callCount(), 2);
  assert.equal(posthog.identify.mock.callCount(), 2);
  assert.equal(posthog.capture.mock.callCount(), 0);
  assert.equal(googleConversion.mock.callCount(), 0);

  effects.length = 0;
  UserSetupProvider({});
  for (const effect of effects) effect();
  await Promise.resolve();
  assert.equal(posthog.capture.mock.callCount(), 0);
});
