// Presents a summary value in the executor workspace.
// Owns the shared card layout for access and deadline summaries.
// Does not calculate values or load data.

import type { ExecutorStatProps } from "@/types/interfaces";

export default function ExecutorStat({
  label,
  value,
  description,
  icon,
}: ExecutorStatProps) {
  return (
    <div className="rounded-2xl border border-default bg-secondary p-5">
      <div className="mb-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <span className="text-xl text-primary dark:text-primary-300">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-xl font-semibold">{value}</div>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}
