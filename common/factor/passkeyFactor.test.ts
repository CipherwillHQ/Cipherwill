// Verifies mobile-compatible passkey requests preserve existing encrypted data.
// Owns credential round trips, legacy vectors and provider failure cases.
// Does not invoke a real browser, security key or password manager.
import assert from "node:assert/strict";
import { after, beforeEach, mock, test } from "node:test";
import { createPasskeyFactor, derivePasskeyFactor, unlockPasskeyFactor, passkeyErrorMessage } from "./passkeyFactor";
import encrypt from "../../crypto/e0/encrypt";
import decrypt from "../../crypto/e0/decrypt";
const rawId = Uint8Array.from(Buffer.from("101112131415161718191a1b1c1d1e1f", "hex")).buffer;
const credential = { type: "public-key", rawId };
const create = mock.fn(async (_options?: CredentialCreationOptions): Promise<any> => credential);
const get = mock.fn(async (_options?: CredentialRequestOptions): Promise<any> => credential);
const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const oldNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
beforeEach(() => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { href: "https://cipherwill.com/app" } } });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { credentials: { create, get } } });
  create.mock.resetCalls(); get.mock.resetCalls();
  create.mock.mockImplementation(async () => credential);
  get.mock.mockImplementation(async () => credential);
});
after(() => {
  if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow);
  else Reflect.deleteProperty(globalThis, "window");
  if (oldNavigator) Object.defineProperty(globalThis, "navigator", oldNavigator);
  else Reflect.deleteProperty(globalThis, "navigator");
});

test("existing passkeys reproduce their exact original public and private keys", async () => {
  const factor = await unlockPasskeyFactor("AAECAwQFBgc=", "04ead7fbacc6b56912eaae8e37aa899795eca5d52fc525f9baf9300a79bdde9384f90b2044ea8c1138caa9e5c983847a410706e87e65320e1afe0fed92475f0cdb");
  assert.equal(factor.privateKey, "ea0b582df1653dfe613c93e743223db7cb6f7787350c017427f5458d7f794a76");
});

test("enrollment produces public factor data that unlocks existing E0 encryption", async () => {
  const factor = await createPasskeyFactor("user-123", "test@example.test", "Test");
  assert.deepEqual(Object.keys(factor).sort(), ["nonce", "publicKey"]);
  const creation = create.mock.calls[0].arguments[0]!.publicKey!;
  assert.equal(creation.rp.id, "cipherwill.com");
  assert.equal(creation.authenticatorSelection!.residentKey, "required");
  assert.equal(creation.authenticatorSelection!.userVerification, "required");
  assert.equal(Buffer.from(creation.user.id as Uint8Array).subarray(0, 8).toString("base64"), factor.nonce);
  const encrypted = JSON.parse(await encrypt(factor.publicKey, Buffer.from("synthetic-vault-key")));
  const unlocked = await unlockPasskeyFactor(factor.nonce, factor.publicKey);
  assert.equal(await decrypt(unlocked.privateKey, Buffer.from(encrypted.ciphertext, "base64"),
    Buffer.from(encrypted.ephemPublicKey, "base64"), Buffer.from(encrypted.iv, "base64"),
    Buffer.from(encrypted.mac, "base64")), "synthetic-vault-key");
  const request = get.mock.calls[0].arguments[0]!.publicKey!;
  assert.equal(request.rpId, "cipherwill.com");
  assert.equal(request.userVerification, "required");
  assert.equal((request.challenge as Uint8Array).byteLength, 32);
  assert.notDeepEqual(request.challenge, creation.challenge);
});

test("choosing a different passkey cannot unlock the selected factor", async () => {
  const original = derivePasskeyFactor(rawId, new Uint8Array(8));
  get.mock.mockImplementationOnce(async () => ({ type: "public-key", rawId: new Uint8Array([9]).buffer }));
  await assert.rejects(unlockPasskeyFactor("AAAAAAAAAAA=", original.publicKey), /does not match/);
});

test("cancelled, empty and unsupported credentials do not create factors", async () => {
  create.mock.mockImplementationOnce(async () => null);
  await assert.rejects(createPasskeyFactor("u", "e", "n"), /cancelled/);
  create.mock.mockImplementationOnce(async () => ({ type: "public-key", rawId: new ArrayBuffer(0) }));
  await assert.rejects(createPasskeyFactor("u", "e", "n"), /credential ID/);
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: {} });
  await assert.rejects(createPasskeyFactor("u", "e", "n"), /unavailable/);
  assert.match(passkeyErrorMessage(new DOMException("cancelled", "NotAllowedError")), /cancelled or unavailable/);
});

test("untrusted hosts never start credential creation or unlocking", async () => {
  window.location.href = "https://cipherwill.com.attacker.test/app";
  await assert.rejects(createPasskeyFactor("u", "e", "n"), /only be used/);
  await assert.rejects(unlockPasskeyFactor("nonce", "key"), /only be used/);
  assert.equal(create.mock.callCount(), 0);
  assert.equal(get.mock.callCount(), 0);
});
