// Defines encrypted upload session creation with an optional restore guard.
// Owns the requirement that existing content must remain absent for restore.
// Does not stage ciphertext or encryption keys.

import { gql } from "@apollo/client";

const CREATE_UPLOAD_POD_SESSION = gql`
  mutation createUploadPodSession(
    $data_model_version: String!
    $ref_id: ID!
    $required_space: Int!
    $require_missing_pod: Boolean
  ) {
    createUploadPodSession(
      data_model_version: $data_model_version
      ref_id: $ref_id
      required_space: $required_space
      require_missing_pod: $require_missing_pod
    ) {
      id
      status
      type
      presigned_upload_url
    }
  }
`;

export default CREATE_UPLOAD_POD_SESSION;
