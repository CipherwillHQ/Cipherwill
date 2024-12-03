"use client";

import { IS_PRODUCTION } from "@/common/constant";
import CompleteProfileStep from "./CompleteProfileStep";
import CompleteNoteCreationStep from "./CompleteNoteCreationStep";
import AddBeneficiaryStep from "./AddBeneficiaryStep";

export default function OnboardingChecklist() {
  return (
    <div className="bg-secondary p-4 rounded-md border border-default h-min">
      <div className="text-xl font-semibold pb-2">
        Get started with Cipherwill
      </div>
      <CompleteProfileStep />
      <div className="border-b border-default py-2 mb-2" />
      <CompleteNoteCreationStep />
      <div className="border-b border-default py-2 mb-2" />
      <AddBeneficiaryStep />
      <div className="border-b border-default py-2 mb-2" />
      <div className="text-sm pt-2 max-w-sm">
        We&apos;ll send you notifications via email to keep your Cipherwill up to
        date with the schedule of your will.
      </div>
      <div className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        We will make sure your data reaches the beneficiaries if you do not
        update your will within predefined schedule of Cipherwill.
      </div>
    </div>
  );
}
