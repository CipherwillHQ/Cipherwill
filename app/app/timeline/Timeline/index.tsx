"use client";
import { useUserContext } from "@/contexts/UserSetupContext";
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
  // 5. make this preference in reminder check in backend
  // 6. make this preium in set preference in backend

  return (
    <div className="flex flex-col gap-2">
      {/* Reset row: moved to its own component for better DX and positioning */}
      <CheckInRow
        title="Time to Check in"
        subtitle="Time for you to check in before receiving your first reminder."
        update_key="first_reminder_after_ms"
        reminder_ms={firstReminderAfterMs}
        desc_one="This is the time interval after which you will receive your first reminder to open Cipherwill if you fail to check in."
      />
      <ExplainerRow
        title="First update reminder date"
        cumulative_ms={parseInt(firstReminderAfterMs)}
        interval={interval}
      />
      <CheckInRow
        title="Time to Check in"
        subtitle="Time for you to check in before receiving your second reminder."
        update_key="second_reminder_after_ms"
        reminder_ms={secondReminderAfterMs}
        desc_one="This is the time interval after which you will receive your second reminder to open Cipherwill if you fail to check in after the first reminder."
      />
      <ExplainerRow
        title="Second update reminder"
        cumulative_ms={parseInt(firstReminderAfterMs) + parseInt(secondReminderAfterMs)}
        interval={interval}
      />
      <CheckInRow
        title="Time to Check in"
        subtitle="Time for you to check in before receiving your last reminder."
        update_key="last_reminder_after_ms"
        reminder_ms={lastReminderAfterMs}
        desc_one="This is the time interval after which you will receive your last reminder to open Cipherwill if you fail to check in after the second reminder."
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
        title="Time to Check in"
        subtitle="Time for you to check in before your will is released to your beneficiary."
        update_key="will_release_after_ms"
        reminder_ms={willReleaseAfterMs}
        desc_one="This is the time interval after which your Cipherwill will be released to your beneficiary if you fail to check in after the last reminder."
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
        subtitle="Time until your beneficiaries have access to your will after release."
        update_key="will_revoke_after_ms"
        reminder_ms={willRevokeAfterMs}
        desc_one="This is the time interval for which your beneficiaries will have access to your Cipherwill after it has been released. After this period, your will and account will be deleted."
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
