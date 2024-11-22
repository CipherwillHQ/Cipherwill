import { gql } from "@apollo/client";

const DELETE_FOLDER = gql`
  mutation DELETE_FOLDER($id: ID!) {
    deleteFolder(id: $id) {
      id
      folder_id
    }
  }
`;

export default DELETE_FOLDER;
