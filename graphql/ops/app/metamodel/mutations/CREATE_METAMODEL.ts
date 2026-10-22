// Defines metadata creation with optional restored beneficiary exclusions.
// Owns ordinary creation and restore inputs plus returned exclusions for caching.
// Does not upload pod contents or assign encryption keys.

import { gql } from "@apollo/client";

const CREATE_METAMODEL = gql`
  mutation CREATE_METAMODEL($id: ID, $type: MetamodelType!, $metadata: String!, $folder_id: String, $ignored_beneficiaries: [String!], $restore: Boolean) {
    createMetamodel(id: $id, type: $type, metadata: $metadata, folder_id: $folder_id, ignored_beneficiaries: $ignored_beneficiaries, restore: $restore) {
      id
      type
      metadata
      ignored_beneficiaries
      created_at
      updated_at
    }
  }
`;

export default CREATE_METAMODEL;
