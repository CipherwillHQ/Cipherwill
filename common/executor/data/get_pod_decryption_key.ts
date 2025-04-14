import logger from "@/common/debug/logger";
import decrypt_e1_value from "./decrypt_e1_value";
import e0_to_e1_decryption from "./e0_to_e1_decryption";

export default async function get_pod_decryption_key({
  encrypted_key,
  time_capsule_private_key,
  current_session_private_key,
}: {
  encrypted_key: string;
  time_capsule_private_key: string;
  current_session_private_key: string | null;
}) {
  const initial_parsed = JSON.parse(encrypted_key);

  switch (initial_parsed.type) {
    case "E0":
      const encrypted_e1_key = await e0_to_e1_decryption({
        e0_encrypted_data: initial_parsed,
        beneficiary_factor_private_key: current_session_private_key
          ? current_session_private_key
          : null,
      });
      if (encrypted_e1_key.type === "E1") {
        return await decrypt_e1_value({
          payload: encrypted_e1_key,
          time_capsule_private_key: time_capsule_private_key,
        });
      } else {
        logger.error(
          "After E0 decryption, There must be E1 Encrypted data. But did not found",
          encrypted_e1_key
        );
      }
      break;
    case "E1":
      return await decrypt_e1_value({
        payload: initial_parsed,
        time_capsule_private_key: time_capsule_private_key,
      });
      break;
    default:
      logger.error("decryption failed", initial_parsed);
      return "xxx-xxx";
  }
}
