import { gql } from "@apollo/client";

const GET_GRANTED_METAMODELS = gql`
  query GET_GRANTED_METAMODELS($access_id: ID!, $type: MetamodelType) {
    getGrantedMetamodels(access_id: $access_id, type: $type) {
      models {
        id
        type
        metadata
        created_at
        updated_at
      }
      has_more
    }
  }
`;

export default GET_GRANTED_METAMODELS;
