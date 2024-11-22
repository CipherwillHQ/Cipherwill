import { gql } from "@apollo/client";

const UPDATE_POD = gql`
  mutation UPDATE_POD(
    $data_model_version: String!
    $ref_id: ID!
    $file: Upload!
  ) {
    updatePod(
      data_model_version: $data_model_version
      ref_id: $ref_id
      file: $file
    ) {
      id
      ref_id
      mime_type
      encoding
      created_at
      updated_at
    }
  }
`;

export default UPDATE_POD;
