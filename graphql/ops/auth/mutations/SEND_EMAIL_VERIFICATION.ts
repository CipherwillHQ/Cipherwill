// What it does: Defines the GraphQL mutation to trigger email verification via backend Resend.
// What it owns: GraphQL operation shape for sending email verification.
// What it does NOT do: Send the email or verify the token directly.

import { gql } from "@apollo/client";

const SEND_EMAIL_VERIFICATION = gql`
  mutation SEND_EMAIL_VERIFICATION {
    sendEmailVerification
  }
`;

export default SEND_EMAIL_VERIFICATION;
