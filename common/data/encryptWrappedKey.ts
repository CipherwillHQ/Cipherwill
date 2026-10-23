// Encrypts a recipient key with cancellation around each crypto operation.
// Owns shared factor and time-capsule wrapping for uploads and migrations.
// Does not read recipients, retain keys, or upload ciphertext.
import encrypt from "@/crypto/e0/encrypt";
export async function encryptWrappedKey(data: string | File, publicKey: string, timeCapsule = false, signal?: AbortSignal): Promise<string> {
  signal?.throwIfAborted();
  const bytes = typeof data === "string" ? Buffer.from(data) : Buffer.from(await data.arrayBuffer());
  signal?.throwIfAborted();
  const result = await encrypt(publicKey, bytes, timeCapsule);
  signal?.throwIfAborted();
  return result;
}
