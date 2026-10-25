// Verifies wallet-factor compatibility and full-signature v2 derivation.
// Owns fixed synthetic vectors, malformed inputs, and encrypted-key round trips.
// Does not connect to wallets, migrate factors, or use real account secrets.
import assert from "node:assert/strict";
import { test } from "node:test";
import crypto from "crypto";
import {
  createMetamaskNonce,
  deriveMetamaskFactor,
  getMetamaskSigningMessage,
} from "./metamaskFactor";
import encrypt from "../../crypto/e0/encrypt";
import decrypt from "../../crypto/e0/decrypt";

const signature = `0x${"11".repeat(64)}1b`;
const sameSuffixSignature = `0x${"22".repeat(61)}1111111b`;
const nonce = "v2:000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";
const legacyFactor = {
  privateKey: "9cdb933670d301c24770932f1f548143ff8455ce84fd18a819c6ec8becd84427",
  publicKey: "0413ff50155125aa7d812aed4a33cdca2bf26f6923a79650325e8d9ab42e7a17ff757c0e6c08208f3c6e23c53cee1072ca74c3eb3c5547e06cd337fc0ed367eed1",
};
const v2Factor = {
  privateKey: "1f70bb7014d2090366a0094f64540f61c42a6a8a4316817496d1feb2de86fa48",
  publicKey: "04c616a3465fdc64cffb6900ba634a68d8957defb23774fe186dbc5c9b6ddbd610978cbc6e6ca0510df7734fdb65f5fa272562dfdd357e079e48461d03e194ce19",
};

test("v1 preserves the exact signing message and original private/public keys", () => {
  assert.equal(getMetamaskSigningMessage("123456"), "Cipherwill Factor: 123456");
  assert.deepEqual(deriveMetamaskFactor(signature, "123456"), legacyFactor);
  for (const legacyNonce of ["0", "999999", "1000000", "older-custom-nonce"]) {
    assert.equal(getMetamaskSigningMessage(legacyNonce), `Cipherwill Factor: ${legacyNonce}`);
    assert.equal(deriveMetamaskFactor(signature, legacyNonce).privateKey,
      crypto.createHash("sha256").update(`${signature.slice(-8)}:${legacyNonce}`).digest("hex"));
  }
});

test("v1 retains its original signature casing behavior", () => {
  const upperSignature = signature.toUpperCase();
  assert.equal(deriveMetamaskFactor(upperSignature, "123456").privateKey,
    crypto.createHash("sha256").update(`${upperSignature.slice(-8)}:123456`).digest("hex"));
});

test("v2 has a stable, dedicated signing message and key vector", () => {
  assert.equal(getMetamaskSigningMessage(nonce),
    `Cipherwill vault encryption v2\nOrigin: https://cipherwill.com\nFactor: ${nonce}\nOnly sign this message to access your encrypted Cipherwill data.`);
  assert.deepEqual(deriveMetamaskFactor(signature, nonce), v2Factor);
  assert.deepEqual(deriveMetamaskFactor(signature, nonce), deriveMetamaskFactor(signature, nonce));
});

test("v2 separates signatures that collide under the v1 suffix formula", () => {
  assert.deepEqual(deriveMetamaskFactor(signature, "123456"), deriveMetamaskFactor(sameSuffixSignature, "123456"));
  assert.notEqual(deriveMetamaskFactor(signature, nonce).publicKey,
    deriveMetamaskFactor(sameSuffixSignature, nonce).publicKey);
});

test("v2 hashes decoded signature bytes and binds the complete nonce", () => {
  assert.deepEqual(deriveMetamaskFactor(`0x${signature.slice(2).toUpperCase()}`, nonce), v2Factor);
  assert.notEqual(deriveMetamaskFactor(signature, `v2:${"ff".repeat(32)}`).publicKey, v2Factor.publicKey);
});

test("new nonces contain 32 random bytes and always select v2", () => {
  const nonces = Array.from({ length: 16 }, () => createMetamaskNonce());
  assert.equal(new Set(nonces).size, nonces.length);
  for (const created of nonces) {
    assert.match(created, /^v2:[0-9a-f]{64}$/);
    assert.match(getMetamaskSigningMessage(created), /^Cipherwill vault encryption v2\n/);
  }
});

test("unknown versions and malformed nonces cannot fall back to v1", () => {
  for (const invalid of ["", "v3:123456", "v2:123456", `v2:${"ab".repeat(31)}`, `v2:${"AB".repeat(32)}`, `V2:${"ab".repeat(32)}`]) {
    assert.throws(() => getMetamaskSigningMessage(invalid), /Unsupported MetaMask factor/);
    assert.throws(() => deriveMetamaskFactor(signature, invalid), /Unsupported MetaMask factor/);
  }
});

test("missing or malformed v2 signatures never become encryption keys", () => {
  for (const invalid of [undefined, null, "", "0x1234", "0x" + "zz".repeat(65), { signature }]) {
    assert.throws(() => deriveMetamaskFactor(invalid, nonce), /Invalid MetaMask signature/);
  }
});

test("both versions unlock wrapped keys without changing the encrypted format", async () => {
  for (const factorNonce of ["123456", nonce]) {
    const factor = deriveMetamaskFactor(signature, factorNonce);
    const wrapped = JSON.parse(await encrypt(factor.publicKey, Buffer.from("synthetic-pod-key")));
    assert.equal(wrapped.type, "E0");
    assert.equal(await decrypt(factor.privateKey, Buffer.from(wrapped.ciphertext, "base64"),
      Buffer.from(wrapped.ephemPublicKey, "base64"), Buffer.from(wrapped.iv, "base64"),
      Buffer.from(wrapped.mac, "base64")), "synthetic-pod-key");
  }
});
