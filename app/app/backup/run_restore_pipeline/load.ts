import toast from "react-hot-toast";
import JSZip from "jszip";
import { sleep } from "../../../../common/time/sleep";
import { RestoreStepError } from "./errors";
import { BackupVersion, LoadedBackupPayload, RunRestoreArgs } from "./types";

type RawBackupPayload = {
  type?: string;
  version?: string;
  data?: unknown;
};

export async function loadRestorePayload(
  { setStatus }: Pick<RunRestoreArgs, "setStatus">,
  backupFile: File
): Promise<LoadedBackupPayload> {
  setStatus("Reading backup file");
  await sleep(1000);

  let rawBackupData: RawBackupPayload;
  try {
    const zipContent = await JSZip.loadAsync(await backupFile.arrayBuffer());
    const backupFileJson = zipContent.files["backup.json"];
    if (!backupFileJson) {
      throw new RestoreStepError("load", "Invalid backup file");
    }
    rawBackupData = JSON.parse(await backupFileJson.async("string"));
  } catch (error) {
    if (error instanceof RestoreStepError) {
      throw error;
    }
    throw new RestoreStepError("load", "Error while reading backup file", error);
  }

  if (rawBackupData.type !== "CIPHERWILL_BACKUP") {
    throw new RestoreStepError("load", "Invalid backup file type");
  }

  setStatus("Checking backup version");
  await sleep(1000);

  const version = rawBackupData.version as BackupVersion;
  if (version !== "0.0.1" && version !== "0.0.2") {
    throw new RestoreStepError("load", "Invalid backup file version");
  }

  if (!Array.isArray(rawBackupData.data)) {
    throw new RestoreStepError("load", "Invalid backup data");
  }

  toast.success("Backup file loaded");

  return {
    version,
    data: rawBackupData.data as LoadedBackupPayload["data"],
  };
}
