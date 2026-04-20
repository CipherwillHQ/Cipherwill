import { gql } from "@apollo/client";

const COMMIT_POD_AND_KEYS = gql`
  mutation commitPodAndKeys(
    $ref_id: ID!
    $data_model_version: String!
    $mode: PodCommitMode!
    $encrypted_text: String
    $items: [KeyInput!]!
  ) {
    commitPodAndKeys(
      ref_id: $ref_id
      data_model_version: $data_model_version
      mode: $mode
      encrypted_text: $encrypted_text
      items: $items
    )
  }
`;

export default COMMIT_POD_AND_KEYS;
