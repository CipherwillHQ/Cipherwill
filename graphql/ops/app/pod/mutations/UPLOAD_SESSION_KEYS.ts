import { gql } from "@apollo/client";

const UPLOAD_SESSION_KEYS = gql`
  mutation uploadSessionKeys($session_id: ID!, $keys: [KeyInput!]!) {
    uploadSessionKeys(session_id: $session_id, keys: $keys) {
      id
      status
      type
    }
  }
`;

export default UPLOAD_SESSION_KEYS;
