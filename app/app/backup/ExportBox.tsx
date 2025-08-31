"use client";
import { useState } from "react";
import Popup from "reactjs-popup";
import { useApolloClient } from "@apollo/client/react";
import { useSession } from "../../../contexts/SessionContext";
import run_backup from "./run_backup";
import { POSSIBLE_STATUS } from "./types";
import SimpleButton from "@/components/common/SimpleButton";

export default function ExportBox() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<POSSIBLE_STATUS>("Not started");
  const [dataPoints, setDataPoints] = useState(0);
  const { session } = useSession();

  const client = useApolloClient();
  return (
    <div className="bg-secondary p-4 rounded-md border border-default w-full max-w-2xl">
      <p className="font-medium max-w-xl">
        This will create a local backup of all your data. This process may take
        long time depending on the amount of data you have.
      </p>
      <p className="pt-2 text-sm text-red-600 font-semibold max-w-xl">
        This backup is not encrypted and can be read by anyone who has access to
        your computer.
      </p>
      <p className="py-4 text-sm text-red-600 font-semibold max-w-xl">
        If you are the beneficiary of someone else's data, and you have
        access to their data. That data will not be included in the backup.
      </p>
      <p className="pb-4 text-sm text-red-600 font-semibold max-w-xl">
        File Storage objects are not included in the backup. Please contact
        support if you need to backup storage objects.
      </p>
      <Popup
        trigger={(open) => (
          <SimpleButton>Create backup of all data</SimpleButton>
        )}
        modal
        closeOnDocumentClick={false}
        overlayStyle={{ background: "rgba(0,0,0,0.5" }}
        onClose={() => {
          setProgress(0);
          setStatus("Not started");
          setDataPoints(0);
        }}
      >
        {/* @ts-ignore */}
        {(close) => {
          return (
            <div className="bg-secondary text-black dark:text-white p-2 rounded-sm w-screen max-w-sm">
              <div className="flex items-center justify-between">
                <h2>Progress</h2>
                <button
                  className="bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded-md" 
                  onClick={() => close()}
                >
                  Close
                </button>
              </div>
              <div
                className={`h-2 bg-gray-200 rounded-full overflow-hidden mt-6 mb-4`}
              >
                <div
                  className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>

              <div>Status: {status}</div>
              {dataPoints > 0 && <div>Encrypted data pods: {dataPoints}</div>}
              <button
                data-cy="start-backup-button"
                className={`w-full px-4 py-2 rounded-md mt-4 ${
                  status !== "Not started"
                    ? "bg-gray-400"
                    : "bg-cyan-700 hover:bg-cyan-800 text-white"
                }`}
                onClick={async () => {
                  await run_backup({
                    status,
                    setStatus,
                    setProgress,
                    session,
                    client,
                    setDataPoints,
                    close,
                  });
                }}
              >
                {status === "Not started"
                  ? "Start backup"
                  : status === "Completed backup"
                  ? "Backup completed"
                  : "Backup in progress"}
              </button>
            </div>
          );
        }}
      </Popup>
    </div>
  );
}
