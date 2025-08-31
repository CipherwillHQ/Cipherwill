"use client";

import { useApolloClient, useQuery } from "@apollo/client/react";
import GET_PERSON_BY_IDS from "../../../graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import GET_ACCESS_DETAILS from "../../../graphql/ops/app/executor/access/queries/GET_ACCESS_DETAILS";
import { useEffect, useState } from "react";

export default function DonorName({ access_id }: { access_id: string }) {
  const [userName, setUserName] = useState("");
  const client = useApolloClient();
  
  const { data, loading, error } = useQuery(GET_ACCESS_DETAILS, {
    variables: {
      id: access_id,
    },
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (data && (data as any).getAccessDetails && (data as any).getAccessDetails.user) {
        const userId = (data as any).getAccessDetails.user;
        const res = await client.query({
          query: GET_PERSON_BY_IDS,
          variables: {
            list: [userId],
          },
        });
        if (res.data && (res.data as any).getPersonByIds) {
          const user_details = (res.data as any).getPersonByIds[0];
          setUserName(
            user_details.first_name
              ? user_details.first_name
              : user_details.email
          );
        }
      }
    };

    fetchUserDetails();
  }, [data, client])
  

  return userName;
}
