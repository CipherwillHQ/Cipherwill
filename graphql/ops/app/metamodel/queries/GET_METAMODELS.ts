import { gql } from "@apollo/client";

const GET_METAMODELS = gql`
  query GET_METAMODELS(
    $type: MetamodelType
    $cursor: String
    $folder_id: String
  ) {
    getMetamodels(type: $type, cursor: $cursor, folder_id: $folder_id) {
      models {
        id
        type
        metadata
        folder_id
        created_at
        updated_at
      }
      has_more
    }
  }
`;

export default GET_METAMODELS;
