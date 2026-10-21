// Presents the identity of the person who shared this will.
// Owns the donor profile card and its loading fallback.
// Does not fetch the donor's protected contents.

"use client";

import { useQuery } from "@apollo/client/react";
import GET_PERSON_BY_IDS from "../../../graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import { TbUserCircle } from "react-icons/tb";
import getPersonDisplayName from "@/common/people/getPersonDisplayName";
import type { GetPersonByIdsData, GetPersonByIdsVariables } from "@/types/interfaces";

export default function DonorDetails({ id }: { id: string }) {
  const { loading, data } = useQuery<GetPersonByIdsData, GetPersonByIdsVariables>(
    GET_PERSON_BY_IDS, 
    {
      variables: {
        list: [id],
      },
    }
  );
  
  const user = data?.getPersonByIds?.[0];
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-default bg-secondary p-5 sm:p-6">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-clay/15 text-clay"><TbUserCircle size={32} /></div>
      <div className="min-w-0 space-y-1">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Digital will of</p>
        <h2 className={"break-words text-xl font-semibold " + (loading ? "animate-pulse" : "")}>
          {user ? getPersonDisplayName(user) : loading ? "Loading donor details…" : "Shared will"}
        </h2>
        {user && <p data-cy="donor-email" className="break-all text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>}
      </div>
    </div>
  );
}
