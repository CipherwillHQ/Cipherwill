// Presents a shared item's heading and timestamps above its contents.
// Owns the common detail layout for notes, account data, and files.
// Does not load or decrypt the item.

import { TbClockHour4 } from "react-icons/tb";
import getTimeAgo from "@/common/time/getTimeAgo";
import type { ExecutorDetailsLayoutProps } from "@/types/interfaces";

export default function ExecutorDetailsLayout({
  title,
  subtitle,
  createdAt,
  updatedAt,
  children,
}: ExecutorDetailsLayoutProps) {
  return (
    <div className="w-full space-y-6">
      <header className="space-y-3">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
        <h1 className="break-words text-2xl font-semibold">{title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1.5"><TbClockHour4 size={15} />Updated {getTimeAgo(Number(updatedAt))}</span>
          <span>Created {getTimeAgo(Number(createdAt))}</span>
        </div>
      </header>
      {children}
    </div>
  );
}
