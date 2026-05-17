import { gql } from "@apollo/client";

const COMMIT_UPLOAD_SESSION = gql`
  mutation commitUploadSession($session_id: ID!) {
    commitUploadSession(session_id: $session_id) {
      id
      status
      type
    }
  }
`;

export default COMMIT_UPLOAD_SESSION;
