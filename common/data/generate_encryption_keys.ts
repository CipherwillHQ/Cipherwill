import { DataItem, EncryptionKey } from "./types";
import crypto from "crypto";

export default async function generate_encryption_key({
  data_item,
}: {
  data_item: DataItem;
}): Promise<EncryptionKey> {
  const key = crypto.randomBytes(24).toString("hex"); // 16 bytes for IV and 32 bytes for key = 48 bytes random key
  return {
    metamodel_ref_id: data_item.ref_id,
    key,
  };
}
