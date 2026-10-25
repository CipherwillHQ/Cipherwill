// Creates and derives versioned MetaMask encryption factors.
// Owns nonce formats, signing messages, and client-only key derivation.
// Does not persist signatures, migrate legacy factors, or call a wallet.
import crypto from "crypto";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");
const V2_NONCE = /^v2:[0-9a-f]{64}$/;

export function createMetamaskNonce(): string {
  return `v2:${crypto.randomBytes(32).toString("hex")}`;
}

export function getMetamaskFactorVersion(nonce: string): 1 | 2 {
  if (typeof nonce === "string" && V2_NONCE.test(nonce)) return 2;
  if (typeof nonce !== "string" || nonce.length === 0 || /^v\d+:/i.test(nonce)) {
    throw new Error("Unsupported MetaMask factor version or nonce. Please update Cipherwill.");
  }
  // The old API accepted arbitrary unversioned strings, not just six-digit nonces.
  return 1;
}

export function getMetamaskSigningMessage(nonce: string): string {
  if (getMetamaskFactorVersion(nonce) === 1) {
    // Existing wallets must sign exactly the same bytes to reproduce their keys.
    return `Cipherwill Factor: ${nonce}`;
  }
  return `Cipherwill vault encryption v2\nOrigin: https://cipherwill.com\nFactor: ${nonce}\nOnly sign this message to access your encrypted Cipherwill data.`;
}

export function deriveMetamaskFactor(signature: unknown, nonce: string) {
  const version = getMetamaskFactorVersion(nonce);
  if (typeof signature !== "string" || signature.length === 0 ||
    (version === 2 && !/^0x[0-9a-fA-F]{130}$/.test(signature))) {
    throw new Error("Invalid MetaMask signature. Please try again.");
  }

  const secret = version === 1
    // Preserve the legacy suffix and string casing; changing either locks out v1.
    ? crypto.createHash("sha256").update(`${signature.slice(-8)}:${nonce}`).digest("hex")
    : crypto.createHash("sha256")
      .update("cipherwill:metamask:v2\0", "utf8")
      .update(Buffer.from(nonce.slice(3), "hex"))
      .update(Buffer.from(signature.slice(2), "hex"))
      .digest("hex");
  const keyPair = ec.keyFromPrivate(secret);
  const privateKey = keyPair.getPrivate("hex");
  return {
    publicKey: keyPair.getPublic("hex"),
    privateKey: version === 1 ? privateKey : privateKey.padStart(64, "0"),
  };
}
