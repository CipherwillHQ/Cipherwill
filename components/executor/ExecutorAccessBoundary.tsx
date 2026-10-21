// Resolves access before displaying pages within a shared will.
// Owns loading and unavailable states and the read-only access banner.
// Does not grant permissions or replace server authorization.

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useAccessDetails } from "@/contexts/AccessDetailsContext";
import DataGridSkeleton from "@/components/app/data/DataGridSkeleton";
import { getExecutorAccessStatus } from "@/common/executor/accessStatus";
import ExecutorAccessBanner from "./ExecutorAccessBanner";
import ExecutorState from "./ExecutorState";

export default function ExecutorAccessBoundary({ children }: { children: ReactNode }) {
  const { accessDetails, loading, error } = useAccessDetails();

  if (loading) return <div role="status" aria-label="Loading will access"><DataGridSkeleton /></div>;
  if (error || !accessDetails || getExecutorAccessStatus(accessDetails.expire_at).expired) {
    return (
      <ExecutorState error title="This will is unavailable" description="Your access may have ended. Return to the dashboard to view your available wills.">
        <Link href="/executor" className="flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">View shared wills</Link>
      </ExecutorState>
    );
  }

  return <><ExecutorAccessBanner />{children}</>;
}
