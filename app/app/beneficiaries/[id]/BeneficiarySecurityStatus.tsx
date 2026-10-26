// Shows whether a beneficiary has added account security factors.
// Owns the current factor lookup and the end-to-end encryption badge.
// Does not expose factor details or calculate data migration status.
"use client";

import { useQuery } from "@apollo/client/react";
import { TbLock } from "react-icons/tb";
import GET_BENEFICIARY_FACTORS from "@/graphql/ops/auth/queries/GET_BENEFICIARY_FACTORS";
import type { GetBeneficiaryFactorsQuery, Person } from "@/types/interfaces";

export default function BeneficiarySecurityStatus({
  beneficiaryId,
  accountType,
}: {
  beneficiaryId: string;
  accountType: Person["__typename"];
}) {
  const isMember = accountType === "User";
  const { data, loading, error } = useQuery<GetBeneficiaryFactorsQuery>(
    GET_BENEFICIARY_FACTORS,
    { skip: !isMember, fetchPolicy: "network-only" }
  );
  const factors = data?.getBeneficiaryFactors?.find(
    (entry) => entry?.beneficiary_id === beneficiaryId
  )?.factors;
  let isEncrypted = false;
  let label = "Security status unavailable";
  let description = "We couldn't check their security factors. Refresh this page to try again.";

  if (accountType === "Guest") {
    label = "No security factors added";
    description = "They need to create a Cipherwill account before adding security factors.";
  } else if (isMember && loading) {
    label = "Checking security factors...";
    description = "";
  } else if (isMember && !error && factors) {
    isEncrypted = factors.some((factor) => Boolean(factor?.id));
    label = isEncrypted ? "End-to-end encrypted" : "No security factors added";
    description = isEncrypted
      ? "This person has added a security factor to their account."
      : "This person hasn't added a security factor to their account.";
  }

  return (
    <div>
      <dt className="text-sm text-neutral-500 dark:text-neutral-400">Security factors</dt>
      <dd className="mt-2">
        <span
          data-cy="beneficiary-security-status"
          role={isMember && loading ? "status" : undefined}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${isEncrypted
            ? "bg-sage/15 text-forest dark:text-cream"
            : "bg-neutral-100 dark:bg-darkAccent"}`}
        >
          {isEncrypted && <TbLock size={16} className="shrink-0" aria-hidden="true" />}
          {label}
        </span>
        {description && (
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        )}
      </dd>
    </div>
  );
}
