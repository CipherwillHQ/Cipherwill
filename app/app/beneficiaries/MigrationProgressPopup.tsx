"use client";

import BasicPopup from "@/components/BasicPopup";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import SimpleButton from "@/components/common/SimpleButton";
import { MigrationProgressState } from "./autoMigration/types";

export default function MigrationProgressPopup({
  progress,
  onClose,
}: {
  progress: MigrationProgressState;
  onClose: () => void;
}) {
  return (
    <BasicPopup
      open={progress.open}
      setOpen={onClose}
      popup_className="max-w-md w-full rounded-lg"
    >
      <div className="p-2">
        <div className="text-lg font-semibold">{progress.title}</div>
        <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
          {progress.description}
        </div>
        {progress.status === "running" && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <LoadingIndicator />
            Please keep this window open.
          </div>
        )}
        {progress.status !== "running" && (
          <div className="mt-4 flex justify-end">
            <SimpleButton onClick={onClose}>Continue</SimpleButton>
          </div>
        )}
      </div>
    </BasicPopup>
  );
}
