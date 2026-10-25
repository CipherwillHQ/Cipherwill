// Presents count-only types as the expanded Data records pill.
// Owns a three-row scrolling viewport and the all-segments link.
// Does not fetch, decrypt or display saved record contents.
import Link from "next/link";
import type { DataRecordsMetricProps } from "@/types/interfaces";
import segments from "@/app/app/segments/raw_segments_list";

export default function DataRecordsBreakdown({ typeCounts, onClose }:
  DataRecordsMetricProps & { onClose: () => void }) {
  const savedTypes = typeCounts.filter(item => item.count > 0);
  return <section aria-label="Data breakdown"
    className="cw-private-guidance ph-no-capture sentry-block flex min-h-0 flex-col pt-2 text-left text-xs text-black dark:text-white">
    {savedTypes.length ? <dl aria-label="Records by type" tabIndex={savedTypes.length > 3 ? 0 : undefined}
      className="max-h-24 min-h-0 overflow-y-auto overscroll-contain customScrollbar px-3 focus-visible:outline-2 focus-visible:outline-inset">
      {savedTypes.map(item => {
        const segment = segments.find(segment => "metamodel_type" in segment && segment.metamodel_type === item.type);
        const label = segment && "title" in segment ? segment.title : item.type.replaceAll("_", " ");
        return <div key={item.type} className="flex h-8 items-center justify-between gap-4">
          <dt title={label} className="min-w-0 truncate text-black/60 dark:text-white/60">{label}</dt>
          <dd className="shrink-0 font-medium tabular-nums">{item.count.toLocaleString()}</dd>
        </div>;
      })}
    </dl> : <p className="px-3 py-4 text-black/60 dark:text-white/60">No data records yet.</p>}
    <Link href="/app/segments" onClick={onClose}
      className="flex min-h-10 shrink-0 items-center justify-between gap-3 px-3 py-2 text-black/60 hover:text-black focus-visible:outline-2 focus-visible:outline-inset dark:text-white/60 dark:hover:text-white">
      <span>See all segments</span><span aria-hidden="true">→</span>
    </Link>
  </section>;
}
