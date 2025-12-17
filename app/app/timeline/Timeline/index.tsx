"use client";
import { useUserContext } from "@/contexts/UserSetupContext";
import TimelineReset from "./TimelineReset";
import EventRow from "./EventRow";

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

  //TODO: remianing tasks
  // 5. make this preference in reminder check in backend
  // 6. make this preium in set preference in backend

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="overflow-x-auto sm:overflow-x-visible">
        <table className="w-full table-auto block sm:table">
          <thead className="hidden sm:table-header-group">
            <tr className="border-b border-default block sm:table-row">
              <th className="text-left p-2 block sm:table-cell">Event</th>
              <th className="text-left p-2 block sm:table-cell">Date</th>
              <th className="text-right p-2 block sm:table-cell">Action</th>
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            <EventRow
              title="First Check-in Reminder"
              interval={interval}
              reminder_ms={firstReminderAfterMs}
              cumulative_ms={parseInt(firstReminderAfterMs)}
              description="This is the date when you will receive your first reminder if you fail to check-in."
              update_key="first_reminder_after_ms"
            />
            <EventRow
              title="Second Check-in Reminder"
              interval={interval}
              reminder_ms={secondReminderAfterMs}
              cumulative_ms={
                parseInt(firstReminderAfterMs) + parseInt(secondReminderAfterMs)
              }
              description="This is the date when you will receive your second reminder if you fail to check-in."
              update_key="second_reminder_after_ms"
            />
            <EventRow
              title="Last Check-in Reminder"
              interval={interval}
              reminder_ms={lastReminderAfterMs}
              cumulative_ms={
                parseInt(firstReminderAfterMs) +
                parseInt(secondReminderAfterMs) +
                parseInt(lastReminderAfterMs)
              }
              description="This is the date when you will receive your last reminder if you fail to check-in."
              update_key="last_reminder_after_ms"
            />
            <EventRow
              title="Will Release to Beneficiary"
              interval={interval}
              reminder_ms={willReleaseAfterMs}
              cumulative_ms={
                parseInt(firstReminderAfterMs) +
                parseInt(secondReminderAfterMs) +
                parseInt(lastReminderAfterMs) +
                parseInt(willReleaseAfterMs)
              }
              description="This is the date when your Cipherwill will be released to your beneficiary if you fail to check-in."
              update_key="will_release_after_ms"
            />
            <EventRow
              title="Will Revoke Access"
              interval={interval}
              reminder_ms={willRevokeAfterMs}
              cumulative_ms={
                parseInt(firstReminderAfterMs) +
                parseInt(secondReminderAfterMs) +
                parseInt(lastReminderAfterMs) +
                parseInt(willReleaseAfterMs) +
                parseInt(willRevokeAfterMs)
              }
              description="This is the date when your beneficiaries will lose access to your Cipherwill and your account will be deleted."
              update_key="will_revoke_after_ms"
            />
            <TimelineReset />
          </tbody>
        </table>
      </div>
    </div>
  );
}
