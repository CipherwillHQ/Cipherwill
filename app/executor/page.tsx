// Renders the executor's dashboard landing page.
// Owns the page introduction and shared wills overview.
// Does not fetch protected data or manage permissions.

import { TbLockAccess } from "react-icons/tb";
import ExecutorDashboard from "@/components/executor/ExecutorDashboard";

export default function Executor() {
  return (
    <div className="w-full space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Execution Dashboard</h1>
          <p className="max-w-xl text-sm text-neutral-500 dark:text-neutral-400">
            A clear view of the digital wills shared with you, and the next steps to take.
          </p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-default bg-secondary px-3 py-1.5 text-xs font-medium">
          <TbLockAccess size={16} className="text-sage" /> Read-only workspace
        </span>
      </header>
      <ExecutorDashboard />
    </div>
  );
}
