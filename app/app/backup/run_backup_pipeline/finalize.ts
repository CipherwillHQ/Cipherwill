import { sleep } from "../../../../common/time/sleep";
import { RunBackupArgs } from "./types";

export async function finalizeBackup({ setStatus, setProgress }: RunBackupArgs) {
  await sleep(1000);
  setStatus("Completed backup");
  setProgress(100);
}
