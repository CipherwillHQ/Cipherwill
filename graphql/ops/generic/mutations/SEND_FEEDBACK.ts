
import { gql } from "@apollo/client";

const SEND_FEEDBACK = gql`
  mutation sendFeedback($email: String, $message: String) {
    sendFeedback(email: $email, message: $message)
  }
`;

export default SEND_FEEDBACK;