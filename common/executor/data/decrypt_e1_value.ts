import logger from "@/common/debug/logger";
import decrypt from "@/crypto/e0/decrypt";
import toast from "react-hot-toast";

export default async function decrypt_e1_value({
  payload,
  time_capsule_private_key,
}: {
  payload: {
    ciphertext: string;
    iv: string;
    mac: string;
    ephemPublicKey: string;
  };
  time_capsule_private_key: string;
}) {
  const e1_value = await decrypt(
    time_capsule_private_key,
    Buffer.from(payload.ciphertext, "base64"),
    Buffer.from(payload.ephemPublicKey, "base64"),
    Buffer.from(payload.iv, "base64"),
    Buffer.from(payload.mac, "base64")
  );
  if (!e1_value) {
    toast.error("Decryption failed by session key");
    logger.error("Decryption failed by session key", payload);
    throw new Error("Decryption failed by session key");
  }
  return e1_value;
}
