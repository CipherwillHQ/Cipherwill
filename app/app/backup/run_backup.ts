import { collectBackupData } from "./run_backup_pipeline/collect";
import { decryptBackupData } from "./run_backup_pipeline/decrypt";
import { finalizeBackup } from "./run_backup_pipeline/finalize";
import { handleBackupError } from "./run_backup_pipeline/handle_error";
import { packageBackupData } from "./run_backup_pipeline/package";
import { validateBackupInput } from "./run_backup_pipeline/validate";
import { RunBackupArgs } from "./run_backup_pipeline/types";

export default async function run_backup({
  status,
  setStatus,
  setProgress,
  session,
  client,
  setDataPoints,
  close,
}: RunBackupArgs) {
  const input: RunBackupArgs = {
    status,
    setStatus,
    setProgress,
    session,
    client,
    setDataPoints,
    close,
  };

  const validation = await validateBackupInput(input);
  if (validation === null) {
    return;
  }

  try {
    const collected = await collectBackupData(input, validation);
    const decrypted = await decryptBackupData(input, validation, collected);
    await packageBackupData(input, decrypted);
    await finalizeBackup(input);
  } catch (error) {
    handleBackupError(error, input);
  }
}
