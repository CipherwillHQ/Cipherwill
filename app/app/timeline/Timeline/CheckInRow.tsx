"use client";

import Select from "@/components/ui/Select";
import UPDATE_PREFERENCES from "@/graphql/ops/auth/mutations/UPDATE_PREFERENCES";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import { useState } from "react";
import BasicPopup from "@/components/BasicPopup";
import { FiEdit, FiX } from "react-icons/fi";
import { useCurrentUserPlan } from "@/contexts/UserSetupContext";
import RestrictedPopup from "@/components/app/common/PlanRestricted/RestrictedPopup";

const available_timeline_values = [
  // variation of 3 day to 1 year
  { value: "259200000", label: "3 days" },
  { value: "432000000", label: "5 days" },
  { value: "604800000", label: "7 days" },
  { value: "864000000", label: "10 days" },
  { value: "1209600000", label: "14 days" },
  { value: "2592000000", label: "1 Month" },
  { value: "5184000000", label: "2 Months" },
  { value: "7776000000", label: "3 Months" },
  { value: "8640000000", label: "100 Days" },
  { value: "15552000000", label: "6 Months" },
  { value: "17280000000", label: "200 Days" },
  { value: "31536000000", label: "1 Year" },
];

export default function CheckInRow({
  title,
  update_key,
  reminder_ms,
}: {
  title: string;
  update_key: string;
  reminder_ms: string;
}) {
  const [updatePreferences, { loading: updating }] =
    useMutation(UPDATE_PREFERENCES);
  const [open, setOpen] = useState(false);
  // const plan = useCurrentUserPlan();
  const plan = "premium"; // TODO: remove this line after testing

  return (
    <div className="flex flex-col sm:flex-row w-full justify-between items-center bg-primary/10 py-2 px-4 rounded-md">
      <div className="text-sm opacity-70 font-medium">{title}</div>
      <div className="text-sm flex items-center">
        {Math.floor(parseInt(reminder_ms) / 86400000)} days{" "}
        {plan === "premium" ? (
          <FiEdit
            className="ml-2 cursor-pointer"
            onClick={() => setOpen(true)}
          />
        ) : (
          <RestrictedPopup
            plan="Premium"
            trigger={<FiEdit className="ml-2 cursor-pointer" />}
          />
        )}
      </div>
      <BasicPopup open={open} setOpen={setOpen} popup_className="p-0">
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-default w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-default">
            <div className="flex items-center gap-3">
              <FiEdit className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Change Reminder Interval
              </h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Close"
            >
              <FiX size={20} className="text-gray-500 hover:cursor-pointer" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                This setting controls how often you need to check in to keep
                your will active.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If you don't check in within this time period, your will may be
                released to beneficiaries. Choose an interval that works for
                your lifestyle.
              </p>
            </div>
            <Select
              className="w-full"
              value={reminder_ms}
              onChange={async (e) => {
                await updatePreferences({
                  variables: {
                    key: update_key,
                    value: e,
                  },
                }).then(() => {
                  toast.success(`Updated preference for reminder interval`);
                  setOpen(false);
                });
              }}
              disabled={updating}
              options={available_timeline_values}
            />
          </div>
        </div>
      </BasicPopup>
    </div>
  );
}
