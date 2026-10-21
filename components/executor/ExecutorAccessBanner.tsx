// Shows access context across every page of a shared will.
// Owns the persistent read-only signal and access deadline.
// Does not authorize requests or display protected contents.

"use client";

import { TbClockHour4, TbShieldCheck } from "react-icons/tb";
import { getExecutorAccessStatus } from "@/common/executor/accessStatus";
import { useAccessDetails } from "@/contexts/AccessDetailsContext";

export default function ExecutorAccessBanner() {
  const { accessDetails } = useAccessDetails();
  if (!accessDetails) return null;
  const status = getExecutorAccessStatus(accessDetails.expire_at);

  return (
    <div className="sticky -top-6 z-10 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sage/25 bg-dashboardCream p-3 text-sm dark:bg-darkCanvas">
      <div className="flex items-center gap-2">
        <TbShieldCheck size={19} className="shrink-0 text-sage" />
        <span className="font-medium">{status.label}</span>
        <span className="text-neutral-500 dark:text-neutral-400">· Read-only</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <TbClockHour4 size={16} className="shrink-0" />
        <span>Available until <time dateTime={status.deadlineIso}>{status.deadlineLabel}</time></span>
      </div>
    </div>
  );
}
