import { gql } from "@apollo/client";

const UPDATE_METAMODEL = gql`
  mutation UPDATE_METAMODEL($data: UpdateMetamodelInput!) {
    updateMetamodel(data: $data) {
      id
      type
      metadata
      created_at
      updated_at
    }
  }
`;

export default UPDATE_METAMODEL;
