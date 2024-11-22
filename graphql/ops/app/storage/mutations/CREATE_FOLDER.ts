import { gql } from "@apollo/client";

const CREATE_FOLDER = gql`
  mutation CREATE_FOLDER($name: String!, $folder_id: String) {
    createFolder(name: $name, folder_id: $folder_id) {
      id
    }
  }
`;

export default CREATE_FOLDER;
