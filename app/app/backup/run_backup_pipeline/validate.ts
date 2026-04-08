import toast from "react-hot-toast";
import getShortKey from "../../../../factory/publicKey/getShortKey";
import getMyKeyCount from "../../../../factory/key/getMyKeyCount";
import { RunBackupArgs, ValidationResult, BackupDataCount } from "./types";

export async function validateBackupInput({
  status,
  setStatus,
  setProgress,
  session,
  client,
  close,
}: RunBackupArgs): Promise<ValidationResult | null> {
  if (status !== "Not started") {
    if (status === "Completed backup") {
      toast.error("Backup already completed");
    } else {
      toast.error("Backup already in progress");
    }
    return null;
  }

  setStatus("Calculating data points");
  setProgress(5);

  const dataCount = (await getMyKeyCount(client)) as BackupDataCount;
  if (dataCount.count < 1) {
    close();
    toast.success("No data to backup");
    return null;
  }

  if (session === null) {
    if (!dataCount.publicKey.includes("null")) {
      close();
      toast.success(
        "Please start session with " + getShortKey(dataCount.publicKey[0])
      );
      return null;
    }

    return {
      dataCount,
      maxPublicKey: "null",
    };
  }

  if (!dataCount.publicKey.includes(session.publicKey)) {
    close();
    toast.success(
      "Please start session with " + getShortKey(dataCount.publicKey[0])
    );
    return null;
  }

  return {
    dataCount,
    maxPublicKey: session.publicKey,
  };
}
