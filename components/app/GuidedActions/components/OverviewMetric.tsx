// Links one account metric to its app page from the guide's opening slide.
// Owns compact label/value pills with hover and keyboard-focus feedback.
// Does not load or calculate metric values.
import Link from "next/link";
import { OVERVIEW_PILL_CLASS } from "./overviewPillClass";

export default function OverviewMetric({ count, label, suffix, href }: {
  count: number | string; label: string; suffix?: string; href: string;
}) {
  return <Link href={href} className={OVERVIEW_PILL_CLASS}>
    <span className="text-black/60 dark:text-white/60">{label}</span>
    <span className="font-medium tabular-nums">
      <span>{count.toLocaleString()}</span>
      {suffix && <span className="ml-1 font-normal text-black/60 dark:text-white/60">{suffix}</span>}
    </span>
  </Link>;
}
