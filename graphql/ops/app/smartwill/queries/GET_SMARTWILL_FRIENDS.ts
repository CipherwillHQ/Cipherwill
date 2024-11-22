import { gql } from "@apollo/client";

const GET_SMARTWILL_FRIENDS = gql`
  query GET_SMARTWILL_FRIENDS {
    getSmartWillFriends
  }
`;

export default GET_SMARTWILL_FRIENDS;