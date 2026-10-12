// What it does: Verifies signup conversion against actual authentication outcomes.
// What it owns: New versus returning users, fallback signup, and conversion failures.
// What it does NOT do: Open a browser or call Firebase, PostHog, or Google services.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import type { UserCredential } from "firebase/auth";

const credential = { user: { uid: "firebase_user", email: "test@example.com" } } as UserCredential;
let isNewUser = true;
let authFailure: { code: string } | undefined;
const capture = mock.fn();
const googleConversion = mock.fn<() => void | Promise<void>>();
const setIsGoogleLoading = mock.fn();
const createAccount = mock.fn(async () => credential);
const handleError = mock.fn((error: unknown) => ({ error }));
const conversionError = new Error("Analytics unavailable");
Object.defineProperty(globalThis, "window", {
  configurable: true, value: { GoogleConverted: googleConversion },
});

mock.module("react", { namedExports: {
  useCallback: (callback: unknown) => callback,
  useMemo: (factory: () => unknown) => factory(),
} });
mock.module(pathToFileURL(require.resolve("firebase/auth")), { namedExports: {
  GoogleAuthProvider: class { addScope() {} },
  createUserWithEmailAndPassword: createAccount,
  signInWithEmailAndPassword: async () => {
    if (authFailure) throw authFailure;
    return credential;
  },
  signInWithPopup: async () => credential,
  signInWithCustomToken: async () => credential,
  getAdditionalUserInfo: () => ({ isNewUser }),
  sendEmailVerification: mock.fn(),
  sendPasswordResetEmail: mock.fn(),
  getIdToken: mock.fn(),
} });
mock.module("./firebase.ts", { namedExports: { authApp: { signOut: mock.fn() } } });
mock.module("./errors.ts", { namedExports: { handle_firebase_error: handleError } });
mock.module(pathToFileURL(require.resolve("posthog-js/react")), { namedExports: {
  usePostHog: () => ({ capture, reset: mock.fn() }),
} });
mock.module("../../common/debug/logger.ts", { defaultExport: { error: mock.fn() } });

beforeEach(() => {
  isNewUser = true;
  authFailure = undefined;
  capture.mock.resetCalls();
  googleConversion.mock.resetCalls();
  createAccount.mock.resetCalls();
  handleError.mock.resetCalls();
});

test("a new email registration records one signup and retains its credential", async () => {
  const { useAuthActions } = await import("./useAuthActions");
  const actions = useAuthActions({ setIsGoogleLoading });
  assert.equal(await actions.createUserWithEmailAndPassword("test@example.com", "password"), credential);
  assert.deepEqual(capture.mock.calls.map(call => call.arguments[0]), ["signup"]);
  assert.equal(googleConversion.mock.callCount(), 1);
});

test("Google signup is counted once; a later login for the same account is not", async () => {
  const { useAuthActions } = await import("./useAuthActions");
  const actions = useAuthActions({ setIsGoogleLoading });
  await actions.googleLogin();
  isNewUser = false;
  await actions.googleLogin();
  assert.equal(capture.mock.calls.filter(call => call.arguments[0] === "signup").length, 1);
  assert.equal(capture.mock.calls.filter(call => call.arguments[0] === "login").length, 2);
  assert.equal(googleConversion.mock.callCount(), 1);
});

test("an existing email login does not record signup", async () => {
  const { useAuthActions } = await import("./useAuthActions");
  isNewUser = false;
  await useAuthActions({ setIsGoogleLoading }).signInWithEmailAndPassword("test@example.com", "password");
  assert.deepEqual(capture.mock.calls.map(call => call.arguments[0]), ["login"]);
  assert.equal(googleConversion.mock.callCount(), 0);
});

test("the user-not-found fallback records its newly created account", async () => {
  const { useAuthActions } = await import("./useAuthActions");
  authFailure = { code: "auth/user-not-found" };
  assert.equal(await useAuthActions({ setIsGoogleLoading }).signInWithEmailAndPassword("test@example.com", "password"), credential);
  assert.equal(createAccount.mock.callCount(), 1);
  assert.deepEqual(capture.mock.calls.map(call => call.arguments[0]), ["signup"]);
});

test("a failed login does not record signup or create an account", async () => {
  const { useAuthActions } = await import("./useAuthActions");
  authFailure = { code: "auth/wrong-password" };
  await useAuthActions({ setIsGoogleLoading }).signInWithEmailAndPassword("test@example.com", "password");
  assert.equal(createAccount.mock.callCount(), 0);
  assert.equal(capture.mock.callCount(), 0);
  assert.equal(handleError.mock.callCount(), 1);
});

test("custom-token login counts only an actual new user", async () => {
  const { useAuthActions } = await import("./useAuthActions");
  const actions = useAuthActions({ setIsGoogleLoading });
  await actions.loginwithCustomToken("token");
  isNewUser = false;
  await actions.loginwithCustomToken("token");
  assert.equal(capture.mock.calls.filter(call => call.arguments[0] === "signup").length, 1);
  assert.equal(googleConversion.mock.callCount(), 1);
});

test("Google conversion errors do not invalidate a successful signup", async () => {
  const { useAuthActions } = await import("./useAuthActions");
  googleConversion.mock.mockImplementationOnce(() => { throw conversionError; });
  assert.equal(await useAuthActions({ setIsGoogleLoading }).createUserWithEmailAndPassword("test@example.com", "password"), credential);
  assert.equal(handleError.mock.callCount(), 0);
  assert.equal(capture.mock.callCount(), 1);
});

test("an asynchronous Google conversion failure does not invalidate signup", async () => {
  const { useAuthActions } = await import("./useAuthActions");
  googleConversion.mock.mockImplementationOnce(async () => { throw conversionError; });
  assert.equal(await useAuthActions({ setIsGoogleLoading }).createUserWithEmailAndPassword("test@example.com", "password"), credential);
  assert.equal(handleError.mock.callCount(), 0);
  assert.equal(capture.mock.callCount(), 1);
});

test("a PostHog failure does not invalidate signup or block Google conversion", async () => {
  const { useAuthActions } = await import("./useAuthActions");
  capture.mock.mockImplementationOnce(() => { throw conversionError; });
  assert.equal(await useAuthActions({ setIsGoogleLoading }).createUserWithEmailAndPassword("test@example.com", "password"), credential);
  assert.equal(handleError.mock.callCount(), 0);
  assert.equal(googleConversion.mock.callCount(), 1);
});
