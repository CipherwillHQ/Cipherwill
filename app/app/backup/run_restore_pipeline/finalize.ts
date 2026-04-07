import toast from "react-hot-toast";
import { RunRestoreArgs } from "./types";

export function finalizeRestore({
  setStatus,
}: Pick<RunRestoreArgs, "setStatus">) {
  setStatus("Backup restored");
  toast.success("Backup restored");
}
