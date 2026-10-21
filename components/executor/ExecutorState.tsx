// Presents calm empty and unavailable states in the executor workspace.
// Owns the status message and an optional recovery action.
// Does not load data or change access.

import { TbAlertCircle, TbLockAccess } from "react-icons/tb";
import type { ExecutorStateProps } from "@/types/interfaces";

export default function ExecutorState({
  title,
  description,
  error = false,
  children,
}: ExecutorStateProps) {
  return (
    <div
      role={error ? "alert" : "status"}
      className="flex flex-col items-center gap-4 rounded-2xl border border-default bg-secondary px-6 py-12 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-clay/15 text-clay">
        {error ? <TbAlertCircle size={28} /> : <TbLockAccess size={28} />}
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-md text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
