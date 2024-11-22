import { gql } from "@apollo/client";

const SEARCH_PERSON = gql`
  query SEARCH_PERSON($email: String!) {
    searchPerson(email: $email) {
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

export default SEARCH_PERSON;
