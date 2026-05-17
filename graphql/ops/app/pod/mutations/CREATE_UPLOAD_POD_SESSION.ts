import { gql } from "@apollo/client";

const CREATE_UPLOAD_POD_SESSION = gql`
  mutation createUploadPodSession(
    $data_model_version: String!
    $ref_id: ID!
    $required_space: Int!
  ) {
    createUploadPodSession(
      data_model_version: $data_model_version
      ref_id: $ref_id
      required_space: $required_space
    ) {
      id
      status
      type
      presigned_upload_url
    }
  }
`;

export default CREATE_UPLOAD_POD_SESSION;
