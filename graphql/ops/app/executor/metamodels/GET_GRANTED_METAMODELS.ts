import { gql } from "@apollo/client";

const GET_GRANTED_METAMODELS = gql`
  query GET_GRANTED_METAMODELS($access_id: ID!, $type: MetamodelType, $cursor: String, $folder_id: String) {
    getGrantedMetamodels(access_id: $access_id, type: $type, cursor: $cursor, folder_id: $folder_id) {
      models {
        id
        type
        metadata
        ignored_beneficiaries
        created_at
        updated_at
      }
      has_more
    }
  }
`;

export default GET_GRANTED_METAMODELS;
