import CryptoJS from "crypto-js";
import getPod from "../../../../factory/pod/getPod";
import decrypt from "../../../../crypto/e0/decrypt";
import logger from "../../../../common/debug/logger";
import { BackupStepError } from "./errors";
import {
  RunBackupArgs,
  ValidationResult,
  CollectionResult,
  BackupDataItem,
} from "./types";

export async function decryptBackupData(
  { setStatus, setProgress, session, client }: RunBackupArgs,
  { dataCount }: ValidationResult,
  { keysByRef, models }: CollectionResult
): Promise<BackupDataItem[]> {
  setStatus("Mapping metadata to pods");
  setProgress(40);

  const backupData: BackupDataItem[] = [];

  for await (const metamodel of models) {
    let encryptedData = await getPod(metamodel.id, client);
    if (encryptedData === null || encryptedData === undefined) {
      encryptedData = "";
    }

    const keyObj = keysByRef[metamodel.id];
    if (keyObj === undefined) {
      continue;
    }

    let key = keyObj.key;
    try {
      if (typeof keyObj.key === "string" && keyObj.key.startsWith("{")) {
        const parsedData = JSON.parse(keyObj.key);
        if (parsedData.type === "E0") {
          if (!session?.privateKey) {
            throw new Error("Session private key is required for E0 decryption");
          }
          key = await decrypt(
            session.privateKey,
            Buffer.from(parsedData.ciphertext, "base64"),
            Buffer.from(parsedData.ephemPublicKey, "base64"),
            Buffer.from(parsedData.iv, "base64"),
            Buffer.from(parsedData.mac, "base64")
          );
        }
      }

      const finalContent = JSON.parse(
        CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8)
      );

      let decryptedData: any = "";
      if (finalContent.data !== undefined) {
        decryptedData = finalContent;
      }

      backupData.push({
        id: metamodel.id,
        type: metamodel.type,
        metadata: metamodel.metadata,
        data: decryptedData,
      });
    } catch (error) {
      logger.error("Backup failed while decrypting pod", {
        metamodel_id: metamodel?.id,
        publicKey: keyObj?.publicKey,
        error,
      });
      throw new BackupStepError(
        "decrypt",
        "Error while decrypting data during backup",
        error
      );
    }
  }

  if (backupData.length !== dataCount.count) {
    throw new BackupStepError("decrypt", "Missing data while backing up");
  }

  return backupData;
}
