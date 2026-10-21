// Presents the shared will's categories as a dashboard card grid.
// Owns populated category grouping, query states, and navigation.
// Does not load item contents or determine beneficiary permissions.

"use client";

import Link from "next/link";
import { TbArrowUpRight } from "react-icons/tb";
import useExecutorSegments from "@/common/executor/hooks/useExecutorSegments";
import DataGridSkeleton from "@/components/app/data/DataGridSkeleton";
import ExecutorState from "./ExecutorState";

export default function ExecutorSegmentGrid({ accessId }: { accessId: string }) {
  const { segments, loading, error, refetch } = useExecutorSegments(accessId);

  if (error) {
    return (
      <ExecutorState error title="Unable to load shared sections" description="Please try again to see the information shared with you.">
        <button type="button" onClick={() => void refetch()} className="min-h-11 rounded-xl border border-default px-5 text-sm font-medium hover:bg-primary-50 dark:hover:bg-darkAccent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Try again</button>
      </ExecutorState>
    );
  }
  if (loading) return <div role="status" aria-label="Loading shared sections"><DataGridSkeleton /></div>;
  if (!segments.length) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Explore shared information</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Choose a category to view the items shared with you.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {segments.map((segment) => {
          if ("divider" in segment) {
            return <h3 key={segment.divider} className="col-span-full pt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{segment.divider}</h3>;
          }
          return (
            <Link
              key={segment.slug}
              href={"/executor/" + accessId + "/" + segment.slug}
              className="group flex flex-col rounded-2xl border border-default bg-secondary p-5 transition-colors hover:border-primary/30 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-xl text-primary dark:bg-darkAccent dark:text-primary-300">{segment.icon}</span>
                <TbArrowUpRight size={20} className="text-neutral-400 group-hover:text-primary dark:group-hover:text-primary-300" />
              </div>
              <h4 className="text-base font-semibold">{segment.title}</h4>
              <p className="mt-2 mb-5 flex-1 text-sm text-neutral-500 dark:text-neutral-400">{segment.description}</p>
              <span className="text-sm font-medium text-primary dark:text-primary-300">View section</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
