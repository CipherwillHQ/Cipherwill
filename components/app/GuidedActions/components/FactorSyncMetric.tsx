// Links the guide's security-factor count and sync status to factor management.
// Owns compact status text and its success or attention indicator.
// Does not synchronize keys or manage security factors.
import Link from "next/link";
import { TbCircleCheck, TbRefresh } from "react-icons/tb";
import type { GuidanceOverview } from "@/types/interfaces";
import { OVERVIEW_PILL_CLASS } from "./overviewPillClass";

export default function FactorSyncMetric({ factorCount, factorsInSync }:
  Pick<GuidanceOverview, "factorCount" | "factorsInSync">) {
  const StatusIcon = factorsInSync ? TbCircleCheck : TbRefresh;
  return <Link href="/app/factors" className={OVERVIEW_PILL_CLASS}>
    <span className="text-black/60 dark:text-white/60">Security factors</span>
    <span className="font-medium tabular-nums">{factorCount.toLocaleString()}</span>
    {factorCount > 0 && <span className="inline-flex items-center gap-1 text-black/60 dark:text-white/60">
      <StatusIcon aria-hidden="true" className={factorsInSync ? "text-sage" : "text-warning"} size={14} />
      {factorsInSync ? "In sync" : "Needs sync"}
    </span>}
  </Link>;
}
