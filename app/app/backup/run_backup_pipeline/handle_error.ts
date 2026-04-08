import toast from "react-hot-toast";
import logger from "../../../../common/debug/logger";
import { BackupStepError } from "./errors";
import { RunBackupArgs } from "./types";

export function handleBackupError(
  error: unknown,
  { setStatus }: Pick<RunBackupArgs, "setStatus">
) {
  if (error instanceof BackupStepError) {
    toast.error(error.message);
    setStatus("Error while backing up");
    logger.error("Backup pipeline step failed", {
      step: error.step,
      error: error.originalError || error,
    });
    return;
  }

  toast.error("Error while backing up");
  setStatus("Error while backing up");
  logger.error("Backup failed unexpectedly", { error });
}
