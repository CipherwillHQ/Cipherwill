// Presents one permission with its identity, deadline, and permitted action.
// Owns shared-will navigation and confirmation before revoking granted access.
// Does not fetch permissions, expire grants, or load will contents.
import Link from "next/link";
import type { GuidanceAccessRowProps } from "@/types/interfaces";
import getPersonDisplayName from "@/common/people/getPersonDisplayName";
import { getExecutorAccessStatus } from "@/common/executor/accessStatus";

export default function AccessRow({ kind, access, person, onClose, onRevoke, revokingId }: GuidanceAccessRowProps) {
  const name = person ? getPersonDisplayName(person) : "Name unavailable";
  const status = getExecutorAccessStatus(access.expire_at);
  return <li className="flex items-center justify-between gap-3 border-b border-default px-3 py-3 last:border-b-0">
    <div className="min-w-0 text-left">
      <div className="break-words font-medium">{name}</div>
      <time dateTime={status.deadlineIso} className="mt-1 block text-[11px] text-black/60 dark:text-white/60">
        {status.expired ? "Scheduled end: " : "Access until: "}{status.deadlineLabel}
      </time>
    </div>
    {kind === "shared" ? status.expired ? <span className="shrink-0 text-black/60 dark:text-white/60">Access ended</span>
      : <Link href={`/executor/${access.id}`} onClick={onClose} aria-label={`View the will of ${name}`}
        className="inline-flex min-h-11 shrink-0 items-center rounded-xl px-3 text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-current dark:text-primary-200">View will</Link>
      : <button type="button" disabled={revokingId !== null || !person} aria-label={`Revoke access for ${name}`}
        onClick={() => { if (window.confirm(`Revoke ${name}'s access to your data?`)) void onRevoke(access.id); }}
        className="min-h-11 shrink-0 cursor-pointer rounded-xl px-3 text-error hover:bg-error/5 focus-visible:outline-2 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-300">
        {revokingId === access.id ? "Revoking…" : "Revoke"}
      </button>}
  </li>;
}
