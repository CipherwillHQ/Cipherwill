"use client";

import Select from "@/components/ui/Select";
import UPDATE_PREFERENCES from "@/graphql/ops/auth/mutations/UPDATE_PREFERENCES";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";

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

  return (
    <div className="flex flex-col sm:flex-row w-full justify-between items-center bg-primary/10 py-2 px-4 rounded-md">
      <div className="text-sm opacity-70 font-medium">
        {title}
      </div>
      <div className="text-sm">
        {Math.floor(parseInt(reminder_ms) / 86400000)} days{" "}
        <Select
          className="ml-2"
          value={reminder_ms}
          onChange={async (e) => {
            await updatePreferences({
              variables: {
                key: update_key,
                value: e,
              },
            }).then(() => {
              toast.success(`Updated preference for reminder interval`);
            });
          }}
          disabled={updating}
          options={available_timeline_values}
        />
      </div>
    </div>
  );
}
