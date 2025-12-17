"use client";
import RestrictedPopup from "@/components/app/common/PlanRestricted/RestrictedPopup";
import BasicPopup from "@/components/BasicPopup";
import Select from "@/components/ui/Select";
import { useCurrentUserPlan } from "@/contexts/UserSetupContext";
import UPDATE_PREFERENCES from "@/graphql/ops/auth/mutations/UPDATE_PREFERENCES";
import { useMutation } from "@apollo/client/react";
import { DateTime } from "luxon";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiX } from "react-icons/fi";

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

export default function EventRow({
  title,
  interval,
  reminder_ms,
  cumulative_ms,
  description,
  update_key,
}: {
  title: string;
  interval: number;
  reminder_ms: string;
  cumulative_ms: number;
  description: string;
  update_key: string;
}) {
  const [updatePreferences, { loading: updating }] =
    useMutation(UPDATE_PREFERENCES);
  const [open, setOpen] = useState(false);
//   const plan = useCurrentUserPlan();
  const plan = "premium";
  return (
    <tr className="block sm:table-row border-b border-default">
      <td className="block sm:table-cell p-2">
        <div className="flex justify-between items-center">
          <span className="sm:hidden font-semibold">Event</span>
          <span>{title}</span>
        </div>
      </td>
      <td className="block sm:table-cell p-2">
        <div className="flex justify-between items-center">
          <span className="sm:hidden font-semibold">Date</span>
          <span>
            {DateTime.now()
              .plus({
                milliseconds:
                  interval * 86400000 + // interval in days * 86400000 to convert to milliseconds
                  cumulative_ms,
              })
              .toJSDate()
              .toDateString()}
          </span>
        </div>
      </td>
      <td className="block sm:table-cell p-2 text-right">
        <div className="flex justify-between items-center">
          <span className="sm:hidden font-semibold">Action:</span>
          <div className="flex-shrink-0 ml-auto">
            {plan === "premium" ? (
              <button
                onClick={() => setOpen(true)}
                className="w-full sm:w-auto inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 border border-default rounded-md text-sm hover:cursor-pointer"
              >
                {Math.floor(parseInt(reminder_ms) / 86400000)} days <FiEdit />
              </button>
            ) : (
              <RestrictedPopup
                plan="Premium"
                trigger={
                  <button className="w-full sm:w-auto inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 border border-default rounded-md text-sm disabled:opacity-60 hover:cursor-pointer">
                    {Math.floor(parseInt(reminder_ms) / 86400000)} days <FiEdit />
                  </button>
                }
              />
            )}
          </div>
        </div>
        <BasicPopup open={open} setOpen={setOpen} popup_className="p-0">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-default w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-default">
              <div className="flex items-center gap-3">
                <FiEdit className="text-blue-500" size={24} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Change Interval
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
              <div className="mb-4 text-center">
                <p className="opacity-75">{description}</p>
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
      </td>
    </tr>
  );
}
