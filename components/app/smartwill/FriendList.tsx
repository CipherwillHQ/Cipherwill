"use client";

import { useQuery } from "@apollo/client";
import GET_SMARTWILL_FRIENDS from "../../../graphql/ops/app/smartwill/queries/GET_SMARTWILL_FRIENDS";
import PersonListById from "./PersonListById";

export default function FriendList() {
  const { loading, data, error } = useQuery(GET_SMARTWILL_FRIENDS);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message} </div>;
  return <PersonListById list={data.getSmartWillFriends} type={"friend"} />;
}
