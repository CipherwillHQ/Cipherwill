// Reads an owner upload session before restore accepts saved content.
// Owns status and evidence that a text pod was committed before its keys.
// Does not create sessions or commit keys.

import { gql } from "@apollo/client";

const GET_UPLOAD_POD_SESSION = gql`
  query GET_UPLOAD_POD_SESSION($ref_id: ID!) {
    getUploadPodSession(ref_id: $ref_id) {
      id
      status
      type
      pod_committed
    }
  }
`;

export default GET_UPLOAD_POD_SESSION;
