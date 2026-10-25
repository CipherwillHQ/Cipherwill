// Defines inline overview expansion and will-access presentation contracts.
// Owns shared pill controls, access rows, and revoke mutation responses.
// Does not include protected will contents or grant new permissions.
import type { ReactNode } from "react";
import type { AccessDetails } from "./metamodel";
import type { Person } from "./people";

export type OverviewExpandedMetric = "records" | "shared" | "granted" | null;
export interface OverviewExpansionProps {
  expanded: OverviewExpandedMetric;
  onExpand: (metric: OverviewExpandedMetric) => void;
}
export interface ExpandableOverviewMetricProps extends OverviewExpansionProps {
  metric: Exclude<OverviewExpandedMetric, null>;
  label: string;
  count: number;
  width: number;
  children: ReactNode;
}
export interface GuidanceAccessListProps {
  kind: "shared" | "granted";
  access: AccessDetails[];
  onClose: () => void;
  onRevoke: (id: string) => Promise<void>;
  revokingId: string | null;
  revokeError: string | null;
}
export interface GuidanceAccessRowProps extends Omit<GuidanceAccessListProps, "access" | "revokeError"> {
  access: AccessDetails;
  person: Person | undefined;
}
export interface RevokeWillAccessData {
  revokeAccessToMyWill: boolean | null;
}
export interface RevokeWillAccessVariables {
  id: string;
}
