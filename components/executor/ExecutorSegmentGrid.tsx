// Presents the shared will's categories as a dashboard card grid.
// Owns category grouping, recipient descriptions, and navigation.
// Does not claim that a category contains granted items.

import Link from "next/link";
import { TbArrowUpRight } from "react-icons/tb";
import { executorSegments } from "@/common/executor/segments";

export default function ExecutorSegmentGrid({ accessId }: { accessId: string }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Explore shared information</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Choose a category to view the items shared with you.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {executorSegments.map((segment) => {
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
