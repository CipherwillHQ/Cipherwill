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
    backupFile.type !== "application/zip"
  ) {
    toast.error("Invalid file type");
    return null;
  }

  return backupFile;
}
