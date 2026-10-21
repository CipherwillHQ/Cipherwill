// Identifies the donor of the will currently open in the sidebar.
// Owns cached access and person queries for the display name.
// Does not fetch the donor's private contents or grant access.

"use client";

import { useQuery } from "@apollo/client/react";
import getPersonDisplayName from "@/common/people/getPersonDisplayName";
import GET_PERSON_BY_IDS from "@/graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import GET_ACCESS_DETAILS from "@/graphql/ops/app/executor/access/queries/GET_ACCESS_DETAILS";
import type { GetAccessDetailsQuery, GetAccessDetailsVariables, GetPersonByIdsData, GetPersonByIdsVariables } from "@/types/interfaces";

export default function DonorName({ access_id }: { access_id: string }) {
  const { data } = useQuery<GetAccessDetailsQuery, GetAccessDetailsVariables>(
    GET_ACCESS_DETAILS,
    { variables: { access_id } },
  );
  const donorId = data?.getAccessDetails?.user;
  const { data: people, loading } = useQuery<GetPersonByIdsData, GetPersonByIdsVariables>(
    GET_PERSON_BY_IDS,
    { variables: { list: donorId ? [donorId] : [] }, skip: !donorId },
  );
  const person = people?.getPersonByIds?.[0];

  return <span>{person ? getPersonDisplayName(person) : loading || !donorId ? "Loading…" : "Shared will"}</span>;
}
