import { gql } from "@apollo/client";

const DELETE_METAMODEL = gql`
  mutation DELETE_METAMODEL($id: ID!) {
    deleteMetamodel(id: $id) {
      id
      folder_id
    }
  }
`;

export default DELETE_METAMODEL;