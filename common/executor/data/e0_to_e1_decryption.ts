import logger from "@/common/debug/logger";
import decrypt from "@/crypto/e0/decrypt";

export default async function e0_to_e1_decryption({
  e0_encrypted_data,
  beneficiary_factor_private_key,
}: {
  e0_encrypted_data: {
    ciphertext: string;
    iv: string;
    mac: string;
    ephemPublicKey: string;
  };
  beneficiary_factor_private_key: string;
}) {
  const encrypted_e1 = JSON.parse(
    await decrypt(
      beneficiary_factor_private_key,
      Buffer.from(e0_encrypted_data.ciphertext, "base64"),
      Buffer.from(e0_encrypted_data.ephemPublicKey, "base64"),
      Buffer.from(e0_encrypted_data.iv, "base64"),
      Buffer.from(e0_encrypted_data.mac, "base64")
    )
  );

  if (!encrypted_e1) {
    logger.error("Decryption failed by session key for e0 to e1");
  }
  return encrypted_e1;
}
