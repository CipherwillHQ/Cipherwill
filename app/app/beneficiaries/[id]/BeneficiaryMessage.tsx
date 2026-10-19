// Displays the beneficiary's saved personal message and its existing editor.
// Owns message preview, preserved line breaks, and the empty-message state.
// Does not load beneficiary records or implement message mutations.

import CustomMessage from "@/components/app/smartwill/CustomMessage";
import type { SmartWillBeneficiary } from "@/types/interfaces";

export default function BeneficiaryMessage({ beneficiary }: { beneficiary: SmartWillBeneficiary }) {
  return (
    <section className="bg-secondary border border-default rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Custom message</h2>
        <CustomMessage beneficiary_id={beneficiary.id} custom_message={beneficiary.custom_message} />
      </div>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        This personal message will be delivered when your will is executed.
      </p>
      {beneficiary.custom_message ? (
        <p className="mt-4 whitespace-pre-wrap wrap-break-word select-text" data-cy="beneficiary-custom-message">
          {beneficiary.custom_message}
        </p>
      ) : (
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          No custom message has been created for this beneficiary.
        </p>
      )}
    </section>
  );
}
