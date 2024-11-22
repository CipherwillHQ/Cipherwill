import { gql } from "@apollo/client";

const GET_PERSON = gql`
  query GET_PERSON($id: ID!) {
    getPerson(id: $id) {
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

export default GET_PERSON;
