// Displays a beneficiary's identity, addition date, and account status.
// Owns the overview card and the legacy missing-date presentation.
// Does not infer membership from email or fetch person data.

import { TbCalendarEvent, TbUser } from "react-icons/tb";
import getPersonDisplayName from "@/common/people/getPersonDisplayName";
import getTimeAgo from "@/common/time/getTimeAgo";
import type { Person, SmartWillBeneficiary } from "@/types/interfaces";

export default function BeneficiaryOverview({
  beneficiary,
  person,
}: {
  beneficiary: SmartWillBeneficiary;
  person: Person;
}) {
  const addedAt = Number(beneficiary.created_at);
  const isMember = person.__typename === "User";
  const isGuest = person.__typename === "Guest";

  return (
    <section className="grid min-w-0 grid-cols-1 gap-6 bg-secondary border border-default rounded-2xl p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-center">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl bg-primary-50 dark:bg-darkAccent p-3 text-primary dark:text-primary-300">
          <TbUser size={24} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold wrap-break-word">{getPersonDisplayName(person)}</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 select-text wrap-break-word">
            {person.email}
          </p>
        </div>
      </div>
      <dl className="grid min-w-0 grid-cols-1 gap-6 border-t border-default pt-6 sm:grid-cols-2 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
        <div>
          <dt className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <TbCalendarEvent size={20} aria-hidden="true" /> Added as beneficiary
          </dt>
          <dd className="mt-2 font-semibold" data-cy="beneficiary-added-date">
            {addedAt > 0 ? (
              <time dateTime={new Date(addedAt).toISOString()}>{getTimeAgo(addedAt, true)}</time>
            ) : "Not recorded"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-neutral-500 dark:text-neutral-400">Cipherwill account</dt>
          <dd className="mt-2">
            <span
              data-cy="beneficiary-account-status"
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${isMember
                ? "bg-sage/15 text-forest dark:text-cream"
                : "bg-neutral-100 dark:bg-darkAccent"}`}
            >
              {isMember ? "On Cipherwill" : isGuest ? "Not on Cipherwill yet" : "Account status unavailable"}
            </span>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {isMember ? "This person has a Cipherwill account." : isGuest
                ? "This person has been invited and has not created an account yet."
                : "We couldn't determine this person's account status."}
            </p>
          </dd>
        </div>
      </dl>
    </section>
  );
}
