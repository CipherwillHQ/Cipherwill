"use client";

import { useQuery } from "@apollo/client";
import GET_PERSON_BY_IDS from "../../../graphql/ops/app/people/queries/GET_PERSON_BY_IDS";

export default function DonorDetails({ id }: { id: string }) {
  const { loading, data, error } = useQuery(GET_PERSON_BY_IDS, {
    variables: {
      list: [id],
    },
  });
  const user = data && data.getPersonByIds && data.getPersonByIds[0];
  return (
    <div className="border border-default p-2 bg-secondary">
      {user && (
        <div>
          Email: <span data-cy="donor-email">{user.email}</span>
          <br />
          Name: {user?.first_name}
        </div>
      )}
    </div>
  );
}
