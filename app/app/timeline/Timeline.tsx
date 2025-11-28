"use client";

import { useUserContext } from "@/contexts/UserSetupContext";
import UPDATE_PREFERENCES from "@/graphql/ops/auth/mutations/UPDATE_PREFERENCES";
import { useMutation } from "@apollo/client/react";
import { DateTime } from "luxon";

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
          {Math.floor(parseInt(firstReminderAfterMs) / 86400000)} days
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center p-2">
        <div className="text-sm opacity-70 font-medium">
          First update reminder
        </div>
        <div className="text-sm">
          {DateTime.now()
            .plus({
              milliseconds:
                interval * 86400000 + // interval in days * 86400000 to convert to milliseconds
                parseInt(firstReminderAfterMs),
            })
            .toJSDate()
            .toDateString()}{" "}
          ({Math.floor(parseInt(firstReminderAfterMs) / 86400000)} Days From
          Failed Check-In)
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center bg-primary/10 py-2 px-4 rounded-md">
        <div className="text-sm opacity-70 font-medium">Time to check in</div>
        <div className="text-sm">
          {Math.floor(parseInt(secondReminderAfterMs) / 86400000)} days
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center p-2">
        <div className="text-sm opacity-70 font-medium">
          Second update reminder
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
          (
          {Math.floor(
            (parseInt(firstReminderAfterMs) + parseInt(secondReminderAfterMs)) /
              86400000
          )}{" "}
          Days From Failed Check-In)
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full justify-between items-center bg-primary/10 py-2 px-4 rounded-md">
        <div className="text-sm opacity-70 font-medium">Time to check in</div>
        <div className="text-sm">
          {Math.floor(parseInt(lastReminderAfterMs) / 86400000)} days
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center p-2">
        <div className="text-sm opacity-70 font-medium">
          Last update reminder
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
          (
          {Math.floor(
            (parseInt(firstReminderAfterMs) +
              parseInt(secondReminderAfterMs) +
              parseInt(lastReminderAfterMs)) /
              86400000
          )}{" "}
          Days From Failed Check-In)
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center bg-primary/10 py-2 px-4 rounded-md">
        <div className="text-sm opacity-70 font-medium">Time to check in</div>
        <div className="text-sm">
          {Math.floor(parseInt(willReleaseAfterMs) / 86400000)} days
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center p-2">
        <div className="text-sm opacity-70 font-medium">
          Will release to beneficiary
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
            .toDateString()}{" "}
          (
          {Math.floor(
            (parseInt(firstReminderAfterMs) +
              parseInt(secondReminderAfterMs) +
              parseInt(lastReminderAfterMs) +
              parseInt(willReleaseAfterMs)) /
              86400000
          )}{" "}
          Days From Failed Check-In)
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center bg-primary/10 py-2 px-4 rounded-md">
        <div className="text-sm opacity-70 font-medium">
          Access to beneficiaries
        </div>
        <div className="text-sm">
          {Math.floor(parseInt(willRevokeAfterMs) / 86400000)} days
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-between items-center p-2">
        <div className="text-sm opacity-70 font-medium text-center sm:text-left">
          Access to beneficiaries will be revoked (all your data will be
          deleted)
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
            .toDateString()}{" "}
          (
          {Math.floor(
            (parseInt(firstReminderAfterMs) +
              parseInt(secondReminderAfterMs) +
              parseInt(lastReminderAfterMs) +
              parseInt(willReleaseAfterMs) +
              parseInt(willRevokeAfterMs)) /
              86400000
          )}{" "}
          Days From Failed Check-In)
        </div>
      </div>
    </div>
  );
}
