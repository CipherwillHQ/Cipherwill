// Transforms a migration page into wrapped keys for its recipients.
// Owns cancellable decrypt/encrypt loops for factor and beneficiary migrations.
// Does not read the network or upload transformed keys.
import decrypt from "../../crypto/e0/decrypt";
import { encryptWrappedKey } from "../data/encryptWrappedKey";
import toast from "react-hot-toast";
import logger from "../debug/logger";
import type { Key } from "../data/types";

export async function transformMigrationKeys(items: any[], privateKey: string | null,
  encryptForPublicKey: string, beneficiaryId?: string, beneficiaryFactors?: any[], signal?: AbortSignal): Promise<Key[]> {
  const all_data = items;

  // decrypt each one with current privatekey
  const all_decrypted:any[] = [];
  for await (const item of all_data) {
    signal?.throwIfAborted();
    if (item.publicKey !== "null") {
      if (privateKey === null) {
        toast.error(
          "Private key not provided to decrypt the data. Skipping Migrate In"
        );
        break;
      }
      try {
        let decryptedKey = item.key;
        if (typeof item.key === "string" && item.key.startsWith("{")) {
          const decrypted_string = JSON.parse(item.key);
          if (decrypted_string.type === "E0") {
            decryptedKey = await decrypt(
              privateKey,
              Buffer.from(decrypted_string.ciphertext, "base64"),
              Buffer.from(decrypted_string.ephemPublicKey, "base64"),
              Buffer.from(decrypted_string.iv, "base64"),
              Buffer.from(decrypted_string.mac, "base64")
            );
          }
        }
        signal?.throwIfAborted();
        all_decrypted.push({
          ref_id: item.ref_id,
          beneficiary_id: item.beneficiary_id,
          key: decryptedKey,
        });
      } catch (error) {
        logger.error("Failed to migrate key while migrating in", {
          ref_id: item?.ref_id,
          publicKey: item?.publicKey,
          error,
        });
        throw error;
      }
    } else {
      all_decrypted.push({
        ref_id: item.ref_id,
        beneficiary_id: item.beneficiary_id,
        key: item.key,
      });
    }
  }

  const re_encrypted_data: Key[] = [];
  // encrypt for this one
  for await (const item of all_decrypted) {
    signal?.throwIfAborted();
    if (beneficiaryId && beneficiaryFactors) {
      const beneficiary = beneficiaryFactors.find(
        (x) => x.beneficiary_id === beneficiaryId
      );

      if (beneficiary) {
        if (beneficiary.factors.length === 0) {
          re_encrypted_data.push({
            beneficiary_id: beneficiaryId,
            ref_id: item.ref_id,
            publicKey: "null",
            key: await encryptWrappedKey(item.key, beneficiary.publicKey, true, signal),
          });
        } else {
          for await (const factor of beneficiary.factors) {
            signal?.throwIfAborted();
            re_encrypted_data.push({
              beneficiary_id: beneficiaryId,
              ref_id: item.ref_id,
              publicKey: factor.publicKey,
              key: await encryptWrappedKey(
                await encryptWrappedKey(item.key, beneficiary.publicKey, true, signal), factor.publicKey, false, signal
              ),
            });
          }
        }
      } else {
        logger.error("Invalid beneficiary ID", beneficiaryId);
      }
    } else {
      re_encrypted_data.push({
        ref_id: item.ref_id,
        publicKey: encryptForPublicKey,
        beneficiary_id: item.beneficiary_id,
        key:
          encryptForPublicKey === "null"
            ? item.key
            : await encryptWrappedKey(item.key, encryptForPublicKey, false, signal),
      });
    }
  }
  signal?.throwIfAborted();
  return re_encrypted_data;
}
