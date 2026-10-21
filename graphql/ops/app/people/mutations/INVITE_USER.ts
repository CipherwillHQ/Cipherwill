// What it does: Requests a person invitation and its email outcome.
// What it owns: Fields needed to distinguish sent, failed, duplicate, and skipped emails.
// What it does NOT do: Assume guest creation means email delivery succeeded.

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
        invitation_email { status reason }
      }
      ... on Guest {
        id
        email
        first_name
        invitation_email { status reason }
      }
    }
  }
`;

export default INVITE_USER;
