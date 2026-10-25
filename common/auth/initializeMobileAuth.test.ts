// Verifies the native token exchange using the installed Firebase authentication SDK.
// Owns bootstrap, refresh, duplicate initialization and failure recovery assertions.
// Does not open a browser or contact Firebase or the production backend.
import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { deleteApp, initializeApp, type FirebaseApp } from "firebase/app";
import { initializeAuth, inMemoryPersistence } from "firebase/auth";
import { FetchProvider } from "@firebase/auth/internal";
import type { MobileAuthWindow, MobileFirebaseSession } from "@/types/interfaces";
import { initializeMobileAuth } from "./initializeMobileAuth";
import { requestMobileAuth } from "./mobileAuthBridge";

const session: MobileFirebaseSession = { uid: "native_uid", idToken: "native-id-token" };
const apps: FirebaseApp[] = [];
const originalFetch = globalThis.fetch;
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalHost = process.env.NEXT_PUBLIC_API_HOST;
const messages: { id: number; type: string }[] = [];
let appNumber = 0;

beforeEach(() => {
  mock.method(FetchProvider, "fetch", () => globalThis.fetch);
  globalThis.fetch = async () => { throw Error("Unexpected network request"); };
  process.env.NEXT_PUBLIC_API_HOST = "https://api.example.test/v1/";
});
afterEach(async () => {
  await Promise.all(apps.splice(0).map(deleteApp));
  globalThis.fetch = originalFetch;
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
  if (originalHost === undefined) delete process.env.NEXT_PUBLIC_API_HOST;
  else process.env.NEXT_PUBLIC_API_HOST = originalHost;
  messages.length = 0;
  mock.restoreAll();
});

function installNativeBridge(value: MobileFirebaseSession | null = session) {
  const target = { CipherwillAuth: { postMessage(message: string) {
    const request = JSON.parse(message);
    messages.push(request);
    if (request.type !== "error") target.CipherwillAuthResponse?.(request.id, request.type === "session" ? value : null);
  } } } as MobileAuthWindow;
  Object.defineProperty(globalThis, "window", { configurable: true, value: target });
}

function createTestAuth() {
  const app = initializeApp({ apiKey: "test-key", projectId: "project-cipherwill" }, `mobile-test-${++appNumber}`);
  apps.push(app);
  return initializeAuth(app, { persistence: inMemoryPersistence });
}

function firebaseExchange(input: string | URL | Request, options?: RequestInit) {
  const url = String(input);
  if (url === "https://api.example.test/rest/v1/mobile-auth") {
    assert.equal(options?.method, "POST");
    assert.deepEqual(options?.headers, { Authorization: "Bearer native-id-token" });
    assert.equal(options?.cache, "no-store");
    return new Response(JSON.stringify({ token: "web-custom-token" }));
  }
  if (url.includes("accounts:signInWithCustomToken")) {
    assert.equal(JSON.parse(String(options?.body)).token, "web-custom-token");
    return new Response(JSON.stringify({ localId: session.uid, idToken: "web-id-token", refreshToken: "web-refresh", expiresIn: "3600", isNewUser: false }));
  }
  assert.match(url, /accounts:lookup/);
  return new Response(JSON.stringify({ users: [{ localId: session.uid, email: "owner@example.test", emailVerified: false, providerUserInfo: [] }] }));
}

test("native ID tokens establish the same Firebase account, then web tokens refresh normally", async () => {
  installNativeBridge();
  globalThis.fetch = async (input, options) => firebaseExchange(input, options);
  const auth = createTestAuth();
  const first = initializeMobileAuth(auth);
  assert.equal(initializeMobileAuth(auth), first);
  await first;
  assert.equal(auth.currentUser?.uid, session.uid);
  assert.equal(auth.currentUser?.email, "owner@example.test");
  assert.equal(auth.currentUser?.emailVerified, false);
  assert.equal(await auth.currentUser?.getIdToken(), "web-id-token");
  globalThis.fetch = async (input, options) => {
    assert.match(String(input), /securetoken.googleapis.com/);
    assert.match(String(options?.body), /refresh_token=web-refresh/);
    return new Response(JSON.stringify({ access_token: "refreshed-token", refresh_token: "web-refresh", expires_in: "3600" }));
  };
  assert.equal(await auth.currentUser?.getIdToken(true), "refreshed-token");
  await auth.signOut();
  await requestMobileAuth("logout");
  assert.equal(auth.currentUser, null);
  assert.deepEqual(messages.map(message => message.type), ["session", "logout"]);
});

test("backend rejection notifies the wrapper and leaves Firebase signed out", async () => {
  installNativeBridge();
  globalThis.fetch = async () => new Response("Unauthorized", { status: 401 });
  const auth = createTestAuth();
  await assert.rejects(initializeMobileAuth(auth), /Unable to authenticate/);
  assert.equal(auth.currentUser, null);
  assert.deepEqual(messages.map(message => message.type), ["session", "error"]);
});

test("an absent native session reports an error without making an exchange request", async () => {
  installNativeBridge(null);
  await assert.rejects(initializeMobileAuth(createTestAuth()), /Native session unavailable/);
  assert.deepEqual(messages.map(message => message.type), ["session", "error"]);
});

test("ordinary browsers retain Firebase authentication without native requests", async () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  await initializeMobileAuth(createTestAuth());
  assert.deepEqual(messages, []);
});
