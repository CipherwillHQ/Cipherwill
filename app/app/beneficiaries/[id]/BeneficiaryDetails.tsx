// Loads a beneficiary and their current person record for the detail page.
// Owns page loading, missing-record, and error states with back navigation.
// Does not calculate segment access or edit custom messages itself.
"use client";

import { useQuery } from "@apollo/client/react";
import type { ReactNode } from "react";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import GET_SMARTWILL_BENEFICIARY from "@/graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import GET_PERSON_BY_IDS from "@/graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import type { GetPersonByIdsData, SmartWillBeneficiariesData } from "@/types/interfaces";
import BeneficiaryOverview from "./BeneficiaryOverview";
import BeneficiarySegmentAccess from "./BeneficiarySegmentAccess";
import BeneficiaryMessage from "./BeneficiaryMessage";

export default function BeneficiaryDetails({ beneficiaryId }: { beneficiaryId: string }) {
  const { data, loading, error } = useQuery<SmartWillBeneficiariesData>(
    GET_SMARTWILL_BENEFICIARY,
    { fetchPolicy: "cache-and-network" }
  );
  const beneficiary = data?.getSmartWillBeneficiaries.find((entry) => entry.id === beneficiaryId);
  const { data: people, loading: personLoading, error: personError } = useQuery<GetPersonByIdsData>(
    GET_PERSON_BY_IDS,
    {
      variables: { list: beneficiary ? [beneficiary.person_id] : [] },
      skip: !beneficiary,
      fetchPolicy: "cache-and-network",
    }
  );
  const person = people?.getPersonByIds.find((entry) => entry.id === beneficiary?.person_id);
  let content: ReactNode;

  if (loading || personLoading) {
    content = <p role="status">Loading beneficiary details...</p>;
  } else if (error || personError) {
    content = <p role="alert">We couldn't load this beneficiary. Refresh this page to try again.</p>;
  } else if (!beneficiary || !person) {
    content = (
      <div className="bg-secondary border border-default rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Beneficiary not found</h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          This person may have been removed from your beneficiaries. Return to the list to choose a beneficiary.
        </p>
      </div>
    );
  } else {
    content = (
      <>
        <BeneficiaryOverview beneficiary={beneficiary} person={person} />
        <BeneficiarySegmentAccess beneficiaryId={beneficiary.id} />
        <BeneficiaryMessage beneficiary={beneficiary} />
      </>
    );
  }

  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Beneficiary details" backPath="/app/beneficiaries" />
      <div className="p-4 space-y-6 max-w-5xl">{content}</div>
    </div>
  );
}
