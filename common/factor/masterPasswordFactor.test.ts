// Verifies password-factor compatibility and the v2 PBKDF2 contract.
// Owns synthetic key vectors, nonce validation, and encrypted-key round trips.
// Does not contact an API, alter factors, or use real account passwords.
import assert from "node:assert/strict";
import { test } from "node:test";
import crypto from "crypto";
import {
  createMasterPasswordNonce,
  deriveMasterPasswordFactor,
  getMasterPasswordFactorVersion,
  isValidNewMasterPassword,
} from "./masterPasswordFactor";
import encrypt from "../../crypto/e0/encrypt";
import decrypt from "../../crypto/e0/decrypt";

const nonce = "v2:pbkdf2-sha256:600000:000102030405060708090a0b0c0d0e0f";
const legacyFactor = {
  privateKey: "969219a7e667631652170167acf8812064f0e688c5c41a0fd5f9d3263f01ba81",
  publicKey: "047076d810fe71d5e8c253f3ec5e543c22a3c9daf2c990801ec8603ca536d8f14ba654ed9462ac0f98b21abb98dcbd2d090ee21d36d0c9a5f7d623ecda0e3d63dc",
};
const v2Factor = {
  privateKey: "5c1fc10e949cf392c06d339657239bffc2494c0cd6629658ba81a792f7a15ca9",
  publicKey: "045245fa06c217644ce594bfa75355c86b3253de7c91529bbba7621466b0992347d7b1af558fe170f36ba05e6301218de137b6b89b5607f56af287377dee4f301c",
};

test("v1 reproduces the original keys for a four-character password", async () => {
  assert.deepEqual(await deriveMasterPasswordFactor("1234", "123456"), legacyFactor);
  for (const legacyNonce of ["0", "999999", "1000000", "older-custom-nonce"]) {
    assert.equal(getMasterPasswordFactorVersion(legacyNonce), 1);
    const factor = await deriveMasterPasswordFactor("1234", legacyNonce);
    assert.equal(factor.privateKey, crypto.createHash("sha256").update(`1234:${legacyNonce}`).digest("hex"));
  }
});

test("v1 preserves password whitespace, Unicode, and the old private-key encoding", async () => {
  const factor = await deriveMasterPasswordFactor("  Café🔐  ", "older-custom-nonce");
  assert.equal(factor.privateKey, "15a7a2a1f450ede7a1bc4f53fd58f4d7c994d1a64b0fa11c070b3fc123ce6cc6");
  assert.equal((await deriveMasterPasswordFactor("legacy-289", "123456")).privateKey,
    "d5a6257ce11816b1c49e289a6f3995f588432ddeb02d9d5a68f06fdbac9185");
});

test("v2 matches an independently calculated PBKDF2-SHA-256 vector", async () => {
  assert.deepEqual(await deriveMasterPasswordFactor("A long synthetic passphrase", nonce), v2Factor);
  assert.deepEqual(await deriveMasterPasswordFactor("A long synthetic passphrase", nonce), v2Factor);
});

test("v2 binds the password and salt without trimming or normalizing either password", async () => {
  const changedSalt = "v2:pbkdf2-sha256:600000:ffffffffffffffffffffffffffffffff";
  assert.notEqual((await deriveMasterPasswordFactor("A long synthetic passphrase", changedSalt)).publicKey, v2Factor.publicKey);
  assert.notEqual((await deriveMasterPasswordFactor("A long synthetic passphrase ", nonce)).publicKey, v2Factor.publicKey);
  const unicodePassword = "  Café🔐1!  ";
  assert.equal((await deriveMasterPasswordFactor(unicodePassword, nonce)).privateKey,
    crypto.pbkdf2Sync(unicodePassword, Buffer.from(nonce.split(":")[3], "hex"), 600000, 32, "sha256").toString("hex"));
});

test("new nonces use v2 with unique 16-byte random salts", () => {
  const nonces = Array.from({ length: 16 }, () => createMasterPasswordNonce());
  assert.equal(new Set(nonces).size, nonces.length);
  for (const created of nonces) {
    assert.match(created, /^v2:pbkdf2-sha256:600000:[0-9a-f]{32}$/);
    assert.equal(getMasterPasswordFactorVersion(created), 2);
  }
});

test("malformed or unknown versions and unapproved work factors never fall back to v1", async () => {
  for (const invalid of ["", "v3:123456", "v2:123456", nonce.replace("600000", "1"),
    nonce.replace("600000", "999999999"), nonce.replace("sha256", "sha1"), nonce.slice(0, -1),
    nonce + "ff", nonce + "\n", " " + nonce, nonce.toUpperCase(), null, undefined]) {
    assert.throws(() => getMasterPasswordFactorVersion(invalid as string), /Unsupported master-password factor/);
    await assert.rejects(deriveMasterPasswordFactor("1234", invalid as string), /Unsupported master-password factor/);
  }
});

test("missing Web Crypto never downgrades v2 and does not prevent v1 unlocking", async (t) => {
  t.mock.getter(globalThis, "crypto", () => undefined as unknown as Crypto);
  assert.deepEqual(await deriveMasterPasswordFactor("1234", "123456"), legacyFactor);
  await assert.rejects(deriveMasterPasswordFactor("Password1!", nonce), /Web Crypto/);
  assert.throws(() => createMasterPasswordNonce(), /Web Crypto/);
});

test("new passwords need eight characters, a number, and a non-whitespace special character", () => {
  for (const password of ["Abcdef1!", "longer password 1!", "éééééé1!"]) {
    assert.equal(isValidNewMasterPassword(password), true);
  }
  for (const password of ["1234", "Abcde1!", "Abcdefgh!", "Abcdefg1", "Abcdefg1 ", "ééééééé1"]) {
    assert.equal(isValidNewMasterPassword(password), false);
  }
});

test("v1 still decrypts data wrapped for its original public key", async () => {
  const wrapped = JSON.parse(await encrypt(legacyFactor.publicKey, Buffer.from("existing-pod-key")));
  const factor = await deriveMasterPasswordFactor("1234", "123456");
  assert.equal(await decrypt(factor.privateKey, Buffer.from(wrapped.ciphertext, "base64"),
    Buffer.from(wrapped.ephemPublicKey, "base64"), Buffer.from(wrapped.iv, "base64"),
    Buffer.from(wrapped.mac, "base64")), "existing-pod-key");
});

test("v2 wraps and unlocks keys using the existing E0 format", async () => {
  const created = await deriveMasterPasswordFactor("Password1!", createMasterPasswordNonce());
  const wrapped = JSON.parse(await encrypt(created.publicKey, Buffer.from("new-pod-key")));
  assert.equal(wrapped.type, "E0");
  assert.equal(await decrypt(created.privateKey, Buffer.from(wrapped.ciphertext, "base64"),
    Buffer.from(wrapped.ephemPublicKey, "base64"), Buffer.from(wrapped.iv, "base64"),
    Buffer.from(wrapped.mac, "base64")), "new-pod-key");
});
