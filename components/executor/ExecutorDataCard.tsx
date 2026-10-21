// Presents a read-only item or folder as a dashboard card.
// Owns the title, updated timestamp, and navigation affordance.
// Does not display sensitive contents or provide editing actions.

import Link from "next/link";
import { TbArrowUpRight } from "react-icons/tb";
import getTimeAgo from "@/common/time/getTimeAgo";
import type { ExecutorDataCardProps } from "@/types/interfaces";

export default function ExecutorDataCard({
  href,
  title,
  updatedAt,
  icon,
}: ExecutorDataCardProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="group block min-w-0 rounded-2xl border border-default bg-secondary p-5 transition-colors hover:border-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-xl text-primary dark:bg-darkAccent dark:text-primary-300">{icon}</span>
        <TbArrowUpRight size={20} className="text-neutral-400 group-hover:text-primary dark:group-hover:text-primary-300" />
      </div>
      <h3 className="break-words text-base font-semibold">{title}</h3>
      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        Updated {getTimeAgo(Number(updatedAt))}
      </p>
    </Link>
  );
}
