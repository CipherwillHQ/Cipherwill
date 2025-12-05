"use client";

import UPDATE_PREFERENCES from "@/graphql/ops/auth/mutations/UPDATE_PREFERENCES";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import { FiRefreshCw } from "react-icons/fi";
import { useState } from "react";
import ConfirmationPopup from "@/components/app/smartwill/ConfirmationPopup";

export default function TimelineReset() {
  const [resetting, setResetting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updatePreferences] = useMutation(UPDATE_PREFERENCES);

  const doReset = async () => {
    setResetting(true);
    try {
      const defaults: Record<string, string> = {
        first_reminder_after_ms: "259200000",
        second_reminder_after_ms: "2592000000",
        last_reminder_after_ms: "5184000000",
        will_release_after_ms: "864000000",
        will_revoke_after_ms: "8640000000",
      };
      await Promise.all(
        Object.entries(defaults).map(([key, value]) =>
          updatePreferences({ variables: { key, value } })
        )
      );
      toast.success("Timeline preferences reset to defaults");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset timeline preferences");
    } finally {
      setResetting(false);
    }
  };

  return (
    <tr className="">
      <td colSpan={3} className="p-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-center sm:text-left">
              Reset timeline to defaults
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Restore recommended reminder intervals (3d, 30d, 60d, 10d release,
              100d revoke). Useful if you want the default safety schedule.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowConfirm(true)}
              disabled={resetting || showConfirm}
              aria-label="Reset timeline preferences to defaults"
              className="w-full sm:w-auto inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 border border-default rounded-md text-sm disabled:opacity-60 hover:cursor-pointer"
            >
              <FiRefreshCw /> Reset to defaults
            </button>
          </div>
          <ConfirmationPopup
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={async () => {
              await doReset();
            }}
            title="Reset timeline preferences"
            message="This will restore recommended reminder intervals (3d, 30d, 60d, 10d release, 100d revoke). Do you want to continue?"
            confirmText="Reset"
            cancelText="Cancel"
            variant="warning"
          />
        </div>
      </td>
    </tr>
  );
}
