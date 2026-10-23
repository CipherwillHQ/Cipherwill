// Encrypts text and binary pod contents before any upload starts.
// Owns ciphertext blobs and validation of the selected symmetric key.
// Does not read the network or stage upload sessions.
import type { EncryptionKeys } from "./types";
import AES from "crypto-js/aes";
import crypto from "crypto";
import logger from "../debug/logger";
import toast from "react-hot-toast";

export async function createEncryptedPodFile({
  encryption_keys,
  item,
}: {
  encryption_keys: EncryptionKeys;
  item: any;
}): Promise<Blob> {
  const encryption_key = encryption_keys[item.ref_id];
  if (!encryption_key) {
    const error = new Error(`Encryption key not found for ref_id ${item.ref_id}`);
    logger.error(`Encrpytion key not found for data item`, error);
    toast.error("Encrpytion key not found for data item");
    throw error;
  }
  let encrypted_file;
  if (typeof item.data === "string") {
    const file_data = AES.encrypt(item.data, encryption_key.key).toString();
    encrypted_file = new Blob([file_data], {
      type: "text/plain",
    });
  } else {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      encryption_key.key.slice(16),
      encryption_key.key.slice(0, 16)
    );
    const encrypted = Buffer.concat([
      cipher.update(
        new Uint8Array(
          await item.data.arrayBuffer() // binary
        ) // 8 bit unsigned integer
      ),
      cipher.final(),
    ]);
    encrypted_file = new Blob([encrypted], {
      type: "data/encrypted",
    });
  }
  return encrypted_file;
}
