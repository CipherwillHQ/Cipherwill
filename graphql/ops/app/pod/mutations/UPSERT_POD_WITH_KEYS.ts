import { gql } from "@apollo/client";

const UPSERT_POD_WITH_KEYS = gql`
  mutation upsertPodWithKeys(
    $data_model_version: String!
    $ref_id: ID!
    $file: Upload!
    $key_cluster: [KeyInput!]!
    $operation_id: String!
  ) {
    upsertPodWithKeys(
      data_model_version: $data_model_version
      ref_id: $ref_id
      file: $file
      key_cluster: $key_cluster
      operation_id: $operation_id
    ) {
      success
      written_pod_ids
      written_key_count
      operation_id
    }
  }
`;

export default UPSERT_POD_WITH_KEYS;
