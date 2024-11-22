import { gql } from "@apollo/client";

const GET_METAMODEL = gql`
  query GET_METAMODEL($id: ID!) {
    getMetamodel(id: $id) {
      id
      type
      metadata
      folder_id
      created_at
      updated_at
    }
  }
`;

export default GET_METAMODEL;
