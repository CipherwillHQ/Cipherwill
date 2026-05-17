import { gql } from "@apollo/client";

const UPLOAD_SESSION_POD = gql`
  mutation uploadSessionPod($session_id: ID!, $file: Upload!) {
    uploadSessionPod(session_id: $session_id, file: $file) {
      id
      status
      type
    }
  }
`;

export default UPLOAD_SESSION_POD;
