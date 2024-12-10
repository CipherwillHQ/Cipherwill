"use client";

import { useApolloClient, useLazyQuery, useQuery } from "@apollo/client";
import GET_PERSON_BY_IDS from "../../../graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import GET_ACCESS_DETAILS from "../../../graphql/ops/app/executor/access/queries/GET_ACCESS_DETAILS";
import { useEffect, useState } from "react";

export default function DonorName({ access_id }: { access_id: string }) {
  const [userName, setUserName] = useState("");
  const client = useApolloClient();
  const [fetch_user_details] = useLazyQuery(GET_ACCESS_DETAILS, {
    variables: {
      id: access_id,
    },
    onCompleted: async (data) => {
      if (data && data.getAccessDetails && data.getAccessDetails.user) {
        const userId = data.getAccessDetails.user;
        const res = await client.query({
          query: GET_PERSON_BY_IDS,
          variables: {
            list: [userId],
          },
        });
        if (res.data && res.data.getPersonByIds) {
          const user_details = res.data.getPersonByIds[0];
          setUserName(
            user_details.first_name
              ? user_details.first_name
              : user_details.email
          );
        }
      }
    },
  });
  useEffect(() => {
    fetch_user_details()
  }, [fetch_user_details])
  

  return userName;
}
