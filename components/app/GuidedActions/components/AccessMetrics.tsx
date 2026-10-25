// Adds conditional incoming and granted-access pills to the guide overview.
// Owns permission-query feedback and the two controlled list expansions.
// Does not replace the email banner or show empty access placeholders.
import type { OverviewExpansionProps } from "@/types/interfaces";
import useGuidanceAccess from "../hooks/useGuidanceAccess";
import ExpandableOverviewMetric from "./ExpandableOverviewMetric";
import AccessList from "./AccessList";

export default function AccessMetrics({ expanded, onExpand }: OverviewExpansionProps) {
  const { shared, granted, onRevoke, revokingId, revokeError } = useGuidanceAccess();
  const sharedAccess = shared.data?.getAllBeneficiaryAccess ?? [];
  const grantedAccess = granted.data?.getAllGrantedBeneficiaries ?? [];
  return <>
    {shared.error && <button type="button" onClick={() => void shared.refetch().catch(() => {})}
      className="min-h-11 cursor-pointer text-xs text-error dark:text-red-300" aria-label="Retry loading shared wills">Shared wills unavailable · Retry</button>}
    {!shared.error && sharedAccess.length > 0 && <ExpandableOverviewMetric metric="shared" label="Shared wills"
      count={sharedAccess.length} width={320} expanded={expanded} onExpand={onExpand}>
      <AccessList kind="shared" access={sharedAccess} onClose={() => onExpand(null)}
        onRevoke={onRevoke} revokingId={revokingId} revokeError={revokeError} />
    </ExpandableOverviewMetric>}
    {granted.error && <button type="button" onClick={() => void granted.refetch().catch(() => {})}
      className="min-h-11 cursor-pointer text-xs text-error dark:text-red-300" aria-label="Retry loading granted access">Granted access unavailable · Retry</button>}
    {!granted.error && grantedAccess.length > 0 && <ExpandableOverviewMetric metric="granted" label="Granted access"
      count={grantedAccess.length} width={320} expanded={expanded} onExpand={onExpand}>
      <AccessList kind="granted" access={grantedAccess} onClose={() => onExpand(null)}
        onRevoke={onRevoke} revokingId={revokingId} revokeError={revokeError} />
    </ExpandableOverviewMetric>}
  </>;
}
