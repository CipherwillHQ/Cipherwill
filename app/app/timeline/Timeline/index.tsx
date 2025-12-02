"use client";

import Select from "@/components/ui/Select";
import { useUserContext } from "@/contexts/UserSetupContext";
import UPDATE_PREFERENCES from "@/graphql/ops/auth/mutations/UPDATE_PREFERENCES";
import { useMutation } from "@apollo/client/react";
import { DateTime } from "luxon";
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

export default function Timeline({ interval }: { interval: number }) {
  const { preferences } = useUserContext();
  if (preferences.first_reminder_after_ms === undefined) {
    return <div className="p-2 animate-pulse">Loading timeline...</div>;
  }
  const firstReminderAfterMs = preferences.first_reminder_after_ms as string;
  const secondReminderAfterMs = preferences.second_reminder_after_ms as string;
  const lastReminderAfterMs = preferences.last_reminder_after_ms as string;
  const willReleaseAfterMs = preferences.will_release_after_ms as string;
  const willRevokeAfterMs = preferences.will_revoke_after_ms as string;

  const [updatePreferences, { loading: updating }] =
    useMutation(UPDATE_PREFERENCES);

  //TODO: remianing tasks
  // 1. add select compoennt ot chnge time to check in boxes
  // 2. call mutation on change of select component
  // 3. give visual indication of loading when mutation is in progress
  // 4. make this feature a premium thing
  // 5. make this preference in reminder check in backend
  // 6. make this preium in set preference in backend

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row w-full justify-between items-center bg-primary/10 py-2 px-4 rounded-md">
        <div className="text-sm opacity-70 font-medium">Time to check in</div>
        <div className="text-sm">
          {Math.floor(parseInt(firstReminderAfterMs) / 86400000)} days{" "}
          <Select
            className="ml-2"
            value={firstReminderAfterMs}
            onChange={async (e) => {
              await updatePreferences({
                variables: {
                  key: "first_reminder_after_ms",
                  value: e,
                },
              }).then(() => {
                toast.success(`Updated time to check for first reminder`);
              });
            }}
            disabled={updating}
            options={available_timeline_values}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center p-2">
        <div className="opacity-70 font-medium text-center sm:text-left">
          First update reminder
          <div className="font-bold text-sm">
            Total {Math.floor(parseInt(firstReminderAfterMs) / 86400000)} Days
            From Failed Check-In
          </div>
        </div>
        <div className="text-sm">
          {DateTime.now()
            .plus({
              milliseconds:
                interval * 86400000 + // interval in days * 86400000 to convert to milliseconds
                parseInt(firstReminderAfterMs),
            })
            .toJSDate()
            .toDateString()}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center bg-primary/10 py-2 px-4 rounded-md">
        <div className="text-sm opacity-70 font-medium">Time to check in</div>
        <div className="text-sm">
          {Math.floor(parseInt(secondReminderAfterMs) / 86400000)} days{" "}
          <Select
            className="ml-2"
            value={secondReminderAfterMs}
            onChange={async (e) => {
              await updatePreferences({
                variables: {
                  key: "second_reminder_after_ms",
                  value: e,
                },
              }).then(() => {
                toast.success(`Updated time to check for second reminder`);
              });
            }}
            disabled={updating}
            options={available_timeline_values}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center p-2">
        <div className="opacity-70 font-medium text-center sm:text-left">
          Second update reminder
          <div className="font-bold text-sm">
            Total{" "}
            {Math.floor(
              (parseInt(firstReminderAfterMs) +
                parseInt(secondReminderAfterMs)) /
                86400000
            )}{" "}
            Days From Failed Check-In
          </div>
        </div>
        <div className="text-sm">
          {DateTime.now()
            .plus({
              milliseconds:
                interval * 86400000 +
                parseInt(firstReminderAfterMs) +
                parseInt(secondReminderAfterMs),
            })
            .toJSDate()
            .toDateString()}{" "}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full justify-between items-center bg-primary/10 py-2 px-4 rounded-md">
        <div className="text-sm opacity-70 font-medium">Time to check in</div>
        <div className="text-sm">
          {Math.floor(parseInt(lastReminderAfterMs) / 86400000)} days{" "}
          <Select
            className="ml-2"
            value={lastReminderAfterMs}
            onChange={async (e) => {
              await updatePreferences({
                variables: {
                  key: "last_reminder_after_ms",
                  value: e,
                },
              }).then(() => {
                toast.success(`Updated time to check for last reminder`);
              });
            }}
            disabled={updating}
            options={available_timeline_values}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center p-2">
        <div className="opacity-70 font-medium text-center sm:text-left">
          Last update reminder
          <div className="font-bold text-sm">
            Total{" "}
            {Math.floor(
              (parseInt(firstReminderAfterMs) +
                parseInt(secondReminderAfterMs) +
                parseInt(lastReminderAfterMs)) /
                86400000
            )}{" "}
            Days From Failed Check-In
          </div>
        </div>
        <div className="text-sm">
          {DateTime.now()
            .plus({
              milliseconds:
                interval * 86400000 +
                parseInt(firstReminderAfterMs) +
                parseInt(secondReminderAfterMs) +
                parseInt(lastReminderAfterMs),
            })
            .toJSDate()
            .toDateString()}{" "}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center bg-primary/10 py-2 px-4 rounded-md">
        <div className="text-sm opacity-70 font-medium">Time to check in</div>
        <div className="text-sm">
          {Math.floor(parseInt(willReleaseAfterMs) / 86400000)} days{" "}
          <Select
            className="ml-2"
            value={willReleaseAfterMs}
            onChange={async (e) => {
              await updatePreferences({
                variables: {
                  key: "will_release_after_ms",
                  value: e,
                },
              }).then(() => {
                toast.success(`Updated time to check for data release`);
              });
            }}
            disabled={updating}
            options={available_timeline_values}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center p-2">
        <div className="opacity-70 font-medium text-center sm:text-left">
          Will release to beneficiary
          <div className="font-bold text-sm">
            Total{" "}
            {Math.floor(
              (parseInt(firstReminderAfterMs) +
                parseInt(secondReminderAfterMs) +
                parseInt(lastReminderAfterMs) +
                parseInt(willReleaseAfterMs)) /
                86400000
            )}{" "}
            Days From Failed Check-In
          </div>
        </div>
        <div className="text-sm">
          {DateTime.now()
            .plus({
              milliseconds:
                interval * 86400000 +
                parseInt(firstReminderAfterMs) +
                parseInt(secondReminderAfterMs) +
                parseInt(lastReminderAfterMs) +
                parseInt(willReleaseAfterMs),
            })
            .toJSDate()
            .toDateString()}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center bg-primary/10 py-2 px-4 rounded-md">
        <div className="text-sm opacity-70 font-medium">
          Data access to beneficiaries via dashboard
        </div>
        <div className="text-sm">
          {Math.floor(parseInt(willRevokeAfterMs) / 86400000)} days{" "}
          <Select
            className="ml-2"
            value={willRevokeAfterMs}
            onChange={async (e) => {
              await updatePreferences({
                variables: {
                  key: "will_revoke_after_ms",
                  value: e,
                },
              }).then(() => {
                toast.success(`Updated time to check for access revocation`);
              });
            }}
            disabled={updating}
            options={available_timeline_values}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center p-2">
        <div className="opacity-70 font-medium text-center sm:text-left">
          Access to beneficiaries will be revoked (all your data will be
          deleted)
          <div className="font-bold text-sm">
            Total{" "}
            {Math.floor(
              (parseInt(firstReminderAfterMs) +
                parseInt(secondReminderAfterMs) +
                parseInt(lastReminderAfterMs) +
                parseInt(willReleaseAfterMs) +
                parseInt(willRevokeAfterMs)) /
                86400000
            )}{" "}
            Days From Failed Check-In
          </div>
          <div className="font-bold text-sm">
            Total {Math.floor(parseInt(willRevokeAfterMs) / 86400000)} Days From
            Access Granted
          </div>
        </div>
        <div className="text-sm">
          {DateTime.now()
            .plus({
              milliseconds:
                interval * 86400000 +
                parseInt(firstReminderAfterMs) +
                parseInt(secondReminderAfterMs) +
                parseInt(lastReminderAfterMs) +
                parseInt(willReleaseAfterMs) +
                parseInt(willRevokeAfterMs),
            })
            .toJSDate()
            .toDateString()}
        </div>
      </div>
    </div>
  );
}
