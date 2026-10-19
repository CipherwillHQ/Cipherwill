// Requests the people associated with beneficiary and friend records.
// Owns identity fields and explicit User or Guest account status.
// Does not fetch beneficiary records or invitation history.

import { gql } from "@apollo/client";

const GET_PERSON_BY_IDS = gql`
  query GET_PERSON_BY_IDS($list: [ID!]!) {
    getPersonByIds(list: $list) {
      __typename
      ... on User {
        id
        email
        first_name
        last_name
      }
      ... on Guest {
        id
        email
        first_name
      }
    }
  }
`;

export default GET_PERSON_BY_IDS;
