// Creates and unlocks passkey factors through browser or Android WebAuthn.
// Owns credential validation and the existing nonce/raw-ID key derivation.
// Does not change existing factor keys or send private keys to the API.
import crypto from "crypto";
import { ec as EC } from "elliptic";
import generateRandomBytes from "@/common/string/generateRandomBytes";
import mergeUint8Arrays from "@/common/string/mergeUint8Arrays";

const ec = new EC("secp256k1");

export function getPasskeyDomain(): string {
  const domain = new URL(window.location.href).hostname;
  if (domain !== "localhost" && domain !== "cipherwill.com") {
    throw new Error("Passkeys can only be used on cipherwill.com.");
  }
  if (!navigator.credentials?.create || !navigator.credentials?.get) {
    throw new Error("Passkeys are unavailable. Update your browser or Android System WebView and try again.");
  }
  return domain;
}

export function derivePasskeyFactor(rawId: ArrayBuffer, nonce: Uint8Array) {
  if (!rawId.byteLength) throw new Error("The passkey did not return a credential ID.");
  const secret = crypto.createHash("sha256")
    .update(mergeUint8Arrays(nonce, new Uint8Array(rawId))).digest("hex");
  const keyPair = ec.keyFromPrivate(secret);
  return { publicKey: keyPair.getPublic("hex"), privateKey: keyPair.getPrivate("hex") };
}

export async function createPasskeyFactor(userId: string, email: string, displayName: string) {
  const domain = getPasskeyDomain();
  const nonce = generateRandomBytes(8);
  const credential = await navigator.credentials.create({ publicKey: {
    challenge: new Uint8Array(generateRandomBytes(32)),
    rp: { id: domain, name: "Cipherwill" },
    user: {
      id: new Uint8Array(mergeUint8Arrays(nonce, new Uint8Array(Buffer.from(userId, "utf-8")))),
      name: email, displayName,
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
    authenticatorSelection: { residentKey: "required", requireResidentKey: true, userVerification: "required" },
    timeout: 120000,
  } }) as PublicKeyCredential | null;
  if (!credential || credential.type !== "public-key") throw new Error("Passkey creation was cancelled. Please try again.");
  const { publicKey } = derivePasskeyFactor(credential.rawId, nonce);
  return { publicKey, nonce: Buffer.from(nonce).toString("base64") };
}

export async function unlockPasskeyFactor(nonce: string, expectedPublicKey: string) {
  const domain = getPasskeyDomain();
  const credential = await navigator.credentials.get({ publicKey: {
    challenge: new Uint8Array(generateRandomBytes(32)), rpId: domain,
    userVerification: "required", timeout: 120000,
  } }) as PublicKeyCredential | null;
  if (!credential || credential.type !== "public-key") throw new Error("Passkey request was cancelled. Please try again.");
  const factor = derivePasskeyFactor(credential.rawId, new Uint8Array(Buffer.from(nonce, "base64")));
  if (factor.publicKey !== expectedPublicKey) throw new Error("This passkey does not match the selected factor. Choose the matching passkey.");
  return factor;
}

export function passkeyErrorMessage(error: unknown): string {
  if (error instanceof Error && ["NotAllowedError", "AbortError"].includes(error.name)) {
    return "The passkey request was cancelled or unavailable. Try again or use another factor.";
  }
  return error instanceof Error ? error.message : "Unable to use this passkey. Try again or use another factor.";
}
