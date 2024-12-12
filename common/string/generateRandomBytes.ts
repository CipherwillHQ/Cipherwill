import crypto from "crypto";

export default function generateRandomBytes(size: number) {
  const randomBytes = new Uint8Array(size);
  crypto.randomFillSync(randomBytes);
  return randomBytes;
}
