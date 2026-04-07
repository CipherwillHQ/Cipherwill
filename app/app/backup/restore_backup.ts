import { handleRestoreError } from "./run_restore_pipeline/handle_error";
import { finalizeRestore } from "./run_restore_pipeline/finalize";
import { loadRestorePayload } from "./run_restore_pipeline/load";
import { runRestoreLoop } from "./run_restore_pipeline/restore";
import { validateRestoreInput } from "./run_restore_pipeline/validate";
import { RunRestoreArgs } from "./run_restore_pipeline/types";

export default async function restore_backup({
  backupFile,
  setStatus,
  client,
  session,
}: RunRestoreArgs) {
  const input: RunRestoreArgs = {
    backupFile,
    setStatus,
    client,
    session,
  };

  const validated = validateRestoreInput(input);
  if (validated === null) {
    return;
  }

  try {
    const payload = await loadRestorePayload(input, validated);
    await runRestoreLoop(input, payload);
    finalizeRestore(input);
  } catch (error) {
    handleRestoreError(error, input);
  }
}
