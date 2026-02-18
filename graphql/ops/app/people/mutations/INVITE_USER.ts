import { gql } from "@apollo/client";

const INVITE_USER = gql`
  mutation INVITE_USER(
    $first_name: String!
    $email: String!
    $send_email: Boolean
    $anonymous_invite: Boolean
  ) {
    inviteUser(
      first_name: $first_name
      email: $email
      send_email: $send_email
      anonymous_invite: $anonymous_invite
    ) {
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
