import { gql } from "@apollo/client";

const CREATE_METAMODEL = gql`
  mutation CREATE_METAMODEL($id: ID, $type: MetamodelType!, $metadata: String!, $folder_id: String) {
    createMetamodel(id: $id, type: $type, metadata: $metadata, folder_id: $folder_id) {
      id
      type
      metadata
      created_at
      updated_at
    }
  }
`;

export default CREATE_METAMODEL;
