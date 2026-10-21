// Presents a shared will and its access deadline.
// Owns donor identification and the link into the read-only workspace.
// Does not grant access or fetch the donor's protected data.

"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { TbArrowUpRight, TbClockHour4, TbShieldCheck, TbUserCircle } from "react-icons/tb";
import getPersonDisplayName from "@/common/people/getPersonDisplayName";
import getTimeRemaining from "@/common/time/getTimeRemaining";
import { getExecutorAccessStatus } from "@/common/executor/accessStatus";
import GET_PERSON_BY_IDS from "@/graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import type { AccessDetails, GetPersonByIdsData, GetPersonByIdsVariables } from "@/types/interfaces";

export default function ExecutorAccessCard({ access }: { access: AccessDetails }) {
  const { data, loading } = useQuery<GetPersonByIdsData, GetPersonByIdsVariables>(
    GET_PERSON_BY_IDS,
    { variables: { list: [access.user] } },
  );
  const person = data?.getPersonByIds?.[0];
  const name = person ? getPersonDisplayName(person) : "Shared will";
  const status = getExecutorAccessStatus(access.expire_at);

  return (
    <article className="flex min-w-0 flex-col gap-5 rounded-2xl border border-default bg-secondary p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-clay/15 text-clay">
          <TbUserCircle size={26} />
        </span>
        <span className={"flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium " + (status.expired ? "bg-neutral-100 dark:bg-darkAccent" : "bg-sage/15")}>
          <TbShieldCheck size={15} className={status.expired ? "text-neutral-500" : "text-sage"} />
          {status.label}
        </span>
      </div>
      <div className="min-w-0">
        <p className="mb-1 text-xs text-neutral-500 dark:text-neutral-400">Digital will of</p>
        <h3 className={"break-words text-lg font-semibold " + (loading ? "animate-pulse" : "")}>{loading ? "Loading name…" : name}</h3>
        {person?.first_name && <p className="mt-1 break-all text-sm text-neutral-500 dark:text-neutral-400">{person.email}</p>}
      </div>
      <div className="mt-auto space-y-1 border-t border-default pt-4 text-sm">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <TbClockHour4 size={17} className="shrink-0" />
          <span>{status.expired ? "Access period ended" : getTimeRemaining(Number(access.expire_at)) + " remaining"}</span>
        </div>
        <time dateTime={status.deadlineIso} className="block pl-6 text-xs text-neutral-500 dark:text-neutral-400">
          Until {status.deadlineLabel}
        </time>
      </div>
      {status.expired ? (
        <span className="flex min-h-11 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-darkAccent dark:text-neutral-400">
          Access ended
        </span>
      ) : (
        <Link
          href={"/executor/" + access.id}
          data-cy="executor-access-link"
          aria-label={"Open the digital will of " + name}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Open will <TbArrowUpRight size={18} />
        </Link>
      )}
    </article>
  );
}
