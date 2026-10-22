// Checks that a selected file can be a backup ZIP.
// Owns file presence and extension or MIME validation.
// Does not trust the extension as proof of valid archive contents.

import toast from "react-hot-toast";
import { RunRestoreArgs } from "./types";

export function validateRestoreInput({
  backupFile,
}: Pick<RunRestoreArgs, "backupFile">): File | null {
  if (!backupFile) {
    toast.error("No file selected");
    return null;
  }

  if (
    backupFile.type !== "application/x-zip-compressed" &&
    backupFile.type !== "application/zip" &&
    !backupFile.name.toLowerCase().endsWith(".zip")
  ) {
    toast.error("Invalid file type");
    return null;
  }

  return backupFile;
}
