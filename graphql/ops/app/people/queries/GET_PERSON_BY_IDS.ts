import { gql } from "@apollo/client";

const GET_PERSON_BY_IDS = gql`
  query GET_PERSON_BY_IDS($list: [ID!]!) {
    getPersonByIds(list: $list) {
      ... on User {
        id
        email
        first_name
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
