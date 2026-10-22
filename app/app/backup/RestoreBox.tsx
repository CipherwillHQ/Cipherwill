// Lets users select and restore a local backup archive.
// Owns restore status, retry selection, and active-run controls.
// Does not parse archives or upload records directly.

import { useApolloClient } from "@apollo/client/react";
import { useSession } from "../../../contexts/SessionContext";
import { useState } from "react";
import restore_backup from "./restore_backup";
import SimpleButton from "@/components/common/SimpleButton";

export default function RestoreBox() {
  const client = useApolloClient();
  const { session } = useSession();
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Not started");
  const [isRestoring, setIsRestoring] = useState(false);

  const handleFileSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setBackupFile(files[0]);
    setStatus("Not started");
  };

  return (
    <div className="flex flex-col bg-secondary p-4 rounded-md border border-default w-full max-w-2xl">
      <h2 className="font-semibold pb-2">
        Select backup zip file to restore your data
      </h2>
      <p className="py-3 text-sm">
        Restore will take some time depending on the size of your backup file
      </p>
      <input
        onChange={handleFileSelected}
        type="file"
        disabled={isRestoring}
        data-cy="restore-file-input"
      />
      {backupFile !== null && !isRestoring && status !== "Backup restored" && (
        <SimpleButton
          className="my-2"
          disabled={isRestoring}
          onClick={async () => {
            setIsRestoring(true);
            try {
              await restore_backup({
                backupFile,
                setStatus,
                client,
                session,
              });
            } finally {
              setIsRestoring(false);
            }
          }}
        >
          {status === "Not started" ? "Start restore" : "Retry restore"}
        </SimpleButton>
      )}
      {status !== "Not started" && (
        <div
          className="bg-slate-100 p-2 my-4 rounded-sm text-center"
          data-cy="restore-status"
        >
          Status: {status}
        </div>
      )}
    </div>
  );
}
