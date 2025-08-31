"use client";

import { useQuery } from "@apollo/client/react";
import GET_PERSON_BY_IDS from "../../../graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import type { 
  GetPersonByIdsQuery
} from "@/types/interfaces/metamodel";
import type { 
  GetPersonByIdsVariables 
} from "@/types/interfaces/people";

export default function DonorDetails({ id }: { id: string }) {
  const { loading, data, error } = useQuery<GetPersonByIdsQuery, GetPersonByIdsVariables>(
    GET_PERSON_BY_IDS, 
    {
      variables: {
        list: [id],
      },
    }
  );
  
  if (loading) return <div>Loading donor details...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  const user = data?.getPersonByIds?.[0];
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
