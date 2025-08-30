"use client";
import Select from "@/components/ui/Select";
import UPDATE_PREFERENCES from "@/graphql/ops/auth/mutations/UPDATE_PREFERENCES";
import { useMutation } from "@apollo/client/react";

const options = [
  {
    value: "365",
    label: "Year",
  },
  {
    value: "180",
    label: "6 Months",
  },
  {
    value: "90",
    label: "3 Months",
  },
  {
    value: "30",
    label: "Month",
  },
  {
    value: "14",
    label: "2 Weeks",
  },
  {
    value: "7",
    label: "Week",
  },
];
export default function CustomCipherwillInterval({
  interval,
}: {
  interval: number;
}) {
  const [updatePreferences, { loading: updating }] =
    useMutation(UPDATE_PREFERENCES);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <span className="mr-2">Start sending reminders if i'm inactive for</span>
      <Select
        options={options}
        className="py-1"
        defaultValue="365"
        disabled={updating}
        value={interval.toString()}
        onChange={(value) => {
          if (updating) return;
          updatePreferences({
            variables: {
              key: "check_in_interval",
              value,
            },
          });
        }}
      />
    </div>
  );
}
