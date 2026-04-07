import toast from "react-hot-toast";
import logger from "../../../../common/debug/logger";
import { RestoreStepError } from "./errors";
import { RunRestoreArgs } from "./types";

export function handleRestoreError(
  error: unknown,
  { setStatus }: Pick<RunRestoreArgs, "setStatus">
) {
  if (error instanceof RestoreStepError) {
    toast.error(error.message);
    setStatus("Error while restoring backup");
    logger.error("Restore pipeline step failed", {
      step: error.step,
      error: error.originalError || error,
    });
    return;
  }

  toast.error("Error while restoring backup");
  setStatus("Error while restoring backup");
  logger.error("Restore failed unexpectedly", { error });
}
