import { gql } from "@apollo/client";

const GET_FOLDER = gql`
  query GET_FOLDER($id: ID!) {
    getFolder(id: $id) {
      id
      name
      folder_id
      created_at
      updated_at
    }
  }
`;

export default GET_FOLDER;
