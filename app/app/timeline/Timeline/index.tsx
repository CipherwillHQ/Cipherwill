"use client";
import { useUserContext } from "@/contexts/UserSetupContext";
import { DateTime } from "luxon";
import CheckInRow from "./CheckInRow";
import ExplainerRow from "./ExplainerRow";
import TimelineReset from "./TimelineReset";

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
  // 4. make this feature a premium thing
  // 5. make this preference in reminder check in backend
  // 6. make this preium in set preference in backend

  return (
    <div className="flex flex-col gap-2">
      {/* Reset row: moved to its own component for better DX and positioning */}
      <CheckInRow
        title="Time to Check in Before First Reminder"
        update_key="first_reminder_after_ms"
        reminder_ms={firstReminderAfterMs}
      />
      <ExplainerRow
        title="First update reminder"
        cumulative_ms={parseInt(firstReminderAfterMs)}
        interval={interval}
      />
      <CheckInRow
        title="Time to Check in Before Second Reminder"
        update_key="second_reminder_after_ms"
        reminder_ms={secondReminderAfterMs}
      />
      <ExplainerRow
        title="Second update reminder"
        cumulative_ms={parseInt(firstReminderAfterMs) + parseInt(secondReminderAfterMs)}
        interval={interval}
      />
      <CheckInRow
        title="Time to Check in Before Last Reminder"
        update_key="last_reminder_after_ms"
        reminder_ms={lastReminderAfterMs}
      />
      <ExplainerRow
        title="Last update reminder"
        cumulative_ms={
          parseInt(firstReminderAfterMs) +
          parseInt(secondReminderAfterMs) +
          parseInt(lastReminderAfterMs)
        }
        interval={interval}
      />
      <CheckInRow
        title="Time to Check in Before Will Release to Beneficiary"
        update_key="will_release_after_ms"
        reminder_ms={willReleaseAfterMs}
      />
      <ExplainerRow
        title="Will release to beneficiary"
        cumulative_ms={
          parseInt(firstReminderAfterMs) +
          parseInt(secondReminderAfterMs) +
          parseInt(lastReminderAfterMs) +
          parseInt(willReleaseAfterMs)
        }
        interval={interval}
      />
      <CheckInRow
        title="Access to beneficiaries"
        update_key="will_revoke_after_ms"
        reminder_ms={willRevokeAfterMs}
      />
      <ExplainerRow
        title="Will revoke access"
        cumulative_ms={
          parseInt(firstReminderAfterMs) +
          parseInt(secondReminderAfterMs) +
          parseInt(lastReminderAfterMs) +
          parseInt(willReleaseAfterMs) +
          parseInt(willRevokeAfterMs)
        }
        interval={interval}
      />
      <TimelineReset />
    </div>
  );
}
