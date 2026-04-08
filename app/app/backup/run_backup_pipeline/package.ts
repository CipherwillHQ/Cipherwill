import JSZip from "jszip";
import { saveAs } from "file-saver";
import { sleep } from "../../../../common/time/sleep";
import { BackupDataItem, RunBackupArgs } from "./types";

export async function packageBackupData(
  { setStatus, setProgress }: RunBackupArgs,
  backupData: BackupDataItem[]
) {
  await sleep(1000);
  setStatus("Creating a zip file");
  setProgress(80);

  const zip = new JSZip();
  zip.file(
    "backup.json",
    JSON.stringify(
      {
        type: "CIPHERWILL_BACKUP",
        version: "0.0.2",
        data: backupData,
      },
      null,
      2
    )
  );

  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "backup.zip");
  });
}
