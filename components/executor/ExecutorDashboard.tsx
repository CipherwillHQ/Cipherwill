// Renders the shared wills overview and handover guidance.
// Owns dashboard query states and summaries derived from existing access records.
// Does not load protected contents or change permissions.

"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { TbCalendarTime, TbFileDescription, TbLockAccess } from "react-icons/tb";
import { getExecutorAccessStatus } from "@/common/executor/accessStatus";
import DataGridSkeleton from "@/components/app/data/DataGridSkeleton";
import GET_ALL_BENEFICIARY_ACCESS from "@/graphql/ops/app/executor/access/queries/GET_ALL_BENEFICIARY_ACCESS";
import type { GetAllBeneficiaryAccessQuery } from "@/types/interfaces";
import ExecutorAccessCard from "./ExecutorAccessCard";
import ExecutorGuide from "./ExecutorGuide";
import ExecutorStat from "./ExecutorStat";
import ExecutorState from "./ExecutorState";

export default function ExecutorDashboard() {
  const { loading, error, data, refetch } = useQuery<GetAllBeneficiaryAccessQuery>(GET_ALL_BENEFICIARY_ACCESS);

  if (loading) return <div role="status" aria-label="Loading shared wills"><DataGridSkeleton /></div>;
  if (error || !data) {
    return (
      <ExecutorState error title="Unable to load shared wills" description="Please try again to see the wills shared with you.">
        <button type="button" onClick={() => void refetch()} className="min-h-11 rounded-xl bg-primary px-5 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Try again</button>
      </ExecutorState>
    );
  }

  const accessList = data.getAllBeneficiaryAccess;
  const activeWills = accessList.filter((access) => !getExecutorAccessStatus(access.expire_at).expired);
  const nextDeadline = activeWills.length
    ? getExecutorAccessStatus(String(Math.min(...activeWills.map((access) => Number(access.expire_at))))).deadlineLabel
    : "No active access";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ExecutorStat label="Available wills" value={activeWills.length} description="Digital wills currently shared with you." icon={<TbFileDescription />} />
        <ExecutorStat label="Next access deadline" value={nextDeadline} description="Each will has its own access period." icon={<TbCalendarTime />} />
        <ExecutorStat label="Access mode" value="Read-only" description="View shared details and download files." icon={<TbLockAccess />} />
      </div>
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <section className="min-w-0 space-y-4 xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Shared wills</h2>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{accessList.length} {accessList.length === 1 ? "will" : "wills"}</span>
          </div>
          {accessList.length ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {accessList.map((access) => <ExecutorAccessCard key={access.id} access={access} />)}
            </div>
          ) : (
            <ExecutorState title="No wills shared with you yet" description="When a digital will is released to you, it will appear here with the information you can access.">
              <Link href="/app" className="flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Go to your dashboard</Link>
            </ExecutorState>
          )}
        </section>
        <ExecutorGuide />
      </div>
    </div>
  );
}
