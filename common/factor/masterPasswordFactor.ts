// Creates and derives versioned master-password encryption factors.
// Owns password policy, nonce formats, and client-only key derivation.
// Does not persist passwords, migrate factors, or change encrypted pod formats.
import crypto from "crypto";
import { Buffer } from "buffer";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");
const V2_PREFIX = "v2:pbkdf2-sha256:600000:";
const V2_NONCE = /^v2:pbkdf2-sha256:600000:[0-9a-f]{32}$/;
export const MASTER_PASSWORD_REQUIREMENTS = "Use at least 8 characters, including a number and a special character.";

export function isValidNewMasterPassword(password: string): boolean {
  return Array.from(password).length >= 8 && /[0-9]/.test(password) && /[\p{P}\p{S}]/u.test(password);
}

export function createMasterPasswordNonce(): string {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto is required to create a master-password factor.");
  }
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  return `${V2_PREFIX}${Buffer.from(salt).toString("hex")}`;
}

export function getMasterPasswordFactorVersion(nonce: string): 1 | 2 {
  if (typeof nonce === "string" && V2_NONCE.exec(nonce)?.[0] === nonce) return 2;
  if (typeof nonce !== "string" || nonce.length === 0 || /^\s*v\d+:/i.test(nonce)) {
    throw new Error("Unsupported master-password factor version or nonce. Please update Cipherwill.");
  }
  // The old API also accepted custom unversioned nonces; preserve their exact bytes.
  return 1;
}

export async function deriveMasterPasswordFactor(password: string, nonce: string) {
  const version = getMasterPasswordFactorVersion(nonce);
  let secret: string;
  if (version === 1) {
    // Keep the original password, separator, nonce, and SHA-256 calculation unchanged.
    secret = crypto.createHash("sha256").update(`${password}:${nonce}`).digest("hex");
  } else {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) throw new Error("Web Crypto is required to unlock this master-password factor.");
    const material = await subtle.importKey(
      "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]
    );
    const bits = await subtle.deriveBits({
      name: "PBKDF2", hash: "SHA-256", iterations: 600000,
      salt: new Uint8Array(Buffer.from(nonce.slice(V2_PREFIX.length), "hex")),
    }, material, 256);
    secret = Buffer.from(bits).toString("hex");
  }
  const keyPair = ec.keyFromPrivate(secret);
  const privateKey = keyPair.getPrivate("hex");
  return {
    publicKey: keyPair.getPublic("hex"),
    privateKey: version === 1 ? privateKey : privateKey.padStart(64, "0"),
  };
}
