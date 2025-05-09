import { gql } from "@apollo/client";

const INVITE_USER = gql`
  mutation INVITE_USER($first_name: String!, $email: String!) {
    inviteUser(first_name: $first_name, email: $email) {
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

export default INVITE_USER;
