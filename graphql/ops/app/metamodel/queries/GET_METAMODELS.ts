// Defines paginated metadata queries for owner records.
// Owns item metadata and beneficiary exclusion fields.
// Does not retrieve or decrypt pod contents.

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
        ignored_beneficiaries
        created_at
        updated_at
      }
      has_more
    }
  }
`;

export default GET_METAMODELS;
