import { gql } from "@apollo/client";

const GET_PRESIGNED_POD_UPLOAD_URL = gql`
  mutation getPresignedPodUploadUrl(
    $data_model_version: String!
    $ref_id: ID!
    $mime_type: String!
    $allowed_space: Int!
  ) {
    getPresignedPodUploadUrl(
      data_model_version: $data_model_version
      ref_id: $ref_id
      mime_type: $mime_type
      allowed_space: $allowed_space
    )
  }
`;

export default GET_PRESIGNED_POD_UPLOAD_URL;