/**
 * OnboardingChecklist/index.tsx
 * What it does: Orchestrates and displays the onboarding progress checklist for the dashboard.
 * What it owns: Queries for steps completion state, progress calculation, vertical list layout, and auto-dismissal logic.
 * What it does NOT do: Does not render the specific step UI details directly (delegated to step sub-components).
 */

"use client";

import { useQuery } from "@apollo/client/react";
import { useUserContext } from "@/contexts/UserSetupContext";
import GET_METAMODELS from "@/graphql/ops/app/metamodel/queries/GET_METAMODELS";
import GET_SMARTWILL_BENEFICIARY from "@/graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import { GetMetamodelsQuery, GetMetamodelsVariables } from "@/types/interfaces/metamodel";
import { SmartWillBeneficiariesData } from "@/types/interfaces/graphql";

import CompleteProfileStep from "./CompleteProfileStep";
import CompleteNoteCreationStep from "./CompleteNoteCreationStep";
import AddBeneficiaryStep from "./AddBeneficiaryStep";

export default function OnboardingChecklist() {
  const { user } = useUserContext();

  const { data: notesData, loading: notesLoading } = useQuery<
    GetMetamodelsQuery,
    GetMetamodelsVariables
  >(GET_METAMODELS, {
    variables: {
      type: "NOTE",
    },
  });

  const { data: beneficiariesData, loading: beneficiariesLoading } =
    useQuery<SmartWillBeneficiariesData>(GET_SMARTWILL_BENEFICIARY);

  // If queries are still loading, return null to prevent content flashing
  if (notesLoading || beneficiariesLoading) {
    return null;
  }

  // Calculate completion states
  const isProfileComplete = user
    ? !(user.first_name === "" || user.birth_date === "0")
    : false;

  const isNoteComplete = (notesData?.getMetamodels?.models?.length ?? 0) > 0;

  const isBeneficiaryComplete =
    (beneficiariesData?.getSmartWillBeneficiaries?.length ?? 0) > 0;

  // Auto-hide if all tasks are complete
  const allComplete = isProfileComplete && isNoteComplete && isBeneficiaryComplete;
  if (allComplete) {
    return null;
  }

  // Calculate completed count
  const completedCount =
    (isProfileComplete ? 1 : 0) +
    (isNoteComplete ? 1 : 0) +
    (isBeneficiaryComplete ? 1 : 0);

  return (
    <div className="bg-secondary p-5 rounded-2xl border border-default h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-default">
        <div>
          <h3 className="text-lg font-semibold text-primary dark:text-cream">
            Get started
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Complete these steps to activate your Cipherwill.
          </p>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 bg-gray-100 dark:bg-darkAccent rounded-full text-gray-700 dark:text-gray-300 w-fit">
          {completedCount} of 3 complete
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <CompleteProfileStep isComplete={isProfileComplete} />
        <CompleteNoteCreationStep isComplete={isNoteComplete} />
        <AddBeneficiaryStep isComplete={isBeneficiaryComplete} />
      </div>
    </div>
  );
}
