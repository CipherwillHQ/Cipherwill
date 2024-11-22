"use client";

import { useQuery } from "@apollo/client";
import GET_PERSON_BY_IDS from "../../graphql/ops/app/people/queries/GET_PERSON_BY_IDS";

export function UserById({ id }) {
  const { loading, data, error } = useQuery(GET_PERSON_BY_IDS, {
    variables: {
      list: [id],
    },
  });
  if (loading)
    return <div className="w-32 h-6 bg-slate-300 animate-pulse inline-block" />;
  if (error) return <div>Error : {JSON.stringify(error)}</div>;

  return (
    <div className="inline-block">
      {data.getPersonByIds[0].first_name
        ? `${data.getPersonByIds[0].first_name}`
        : `${data.getPersonByIds[0].email}`}
    </div>
  );
}
