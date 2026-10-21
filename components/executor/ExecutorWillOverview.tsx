// Renders the overview of the will currently shared with the executor.
// Owns donor context, access summaries, and the category grid.
// Does not fetch or decrypt protected contents.

"use client";

import { TbCalendarTime, TbLockAccess, TbShieldCheck } from "react-icons/tb";
import { getExecutorAccessStatus } from "@/common/executor/accessStatus";
import getTimeRemaining from "@/common/time/getTimeRemaining";
import { useAccessDetails } from "@/contexts/AccessDetailsContext";
import DonorDetails from "@/app/executor/[id]/DonorDetails";
import ExecutorStat from "./ExecutorStat";
import ExecutorSegmentGrid from "./ExecutorSegmentGrid";

export default function ExecutorWillOverview() {
  const { accessDetails } = useAccessDetails();
  if (!accessDetails) return null;
  const status = getExecutorAccessStatus(accessDetails.expire_at);

  return (
    <div className="w-full space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Will overview</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          The information and wishes entrusted to you, together in one place.
        </p>
      </header>
      <DonorDetails id={accessDetails.user} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ExecutorStat label="Access status" value={status.label} description="You can review the information shared with you." icon={<TbShieldCheck />} />
        <ExecutorStat label="Time remaining" value={status.expired ? "Access ended" : getTimeRemaining(Number(accessDetails.expire_at))} description={"Available until " + status.deadlineLabel + "."} icon={<TbCalendarTime />} />
        <ExecutorStat label="Access mode" value="Read-only" description="View shared details and download files." icon={<TbLockAccess />} />
      </div>
      <ExecutorSegmentGrid accessId={accessDetails.id} />
    </div>
  );
}
