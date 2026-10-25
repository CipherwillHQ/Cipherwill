// Expands Data records inside the overview so nearby controls make room.
// Owns the record count and breakdown inside the shared expandable pill.
// Does not fetch records or interrupt the setup flow.
import type { DataRecordsMetricProps, OverviewExpansionProps } from "@/types/interfaces";
import DataRecordsBreakdown from "./DataRecordsBreakdown";
import ExpandableOverviewMetric from "./ExpandableOverviewMetric";

export default function DataRecordsMetric(props: DataRecordsMetricProps & OverviewExpansionProps) {
  return <ExpandableOverviewMetric metric="records" label="Data records" count={props.count} width={256}
    expanded={props.expanded} onExpand={props.onExpand}>
    <DataRecordsBreakdown {...props} onClose={() => props.onExpand(null)} />
  </ExpandableOverviewMetric>;
}
