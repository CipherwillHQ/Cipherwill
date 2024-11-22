import logger from "../debug/logger";
import { DataItem, EncryptionKeys } from "./types";
import crypto from "crypto";

export default async function generate_encryption_keys({
  data_items = [],
}: {
  data_items: DataItem[];
}): Promise<EncryptionKeys> {
  let random_keys: EncryptionKeys = {};
  for await (const item of data_items) {
    const key = crypto.randomBytes(24).toString("hex"); // 16 bytes for IV and 32 bytes for key = 48 bytes random key
    random_keys[item.ref_id] = {
      metamodel_ref_id: item.ref_id,
      key,
    };
    logger.info(`Random key generated for ${item.ref_id}: ${key}`);
  }
  return random_keys;
}
