import { gql } from "@apollo/client";

const GET_FOLDERS = gql`
  query GET_FOLDERS($folder_id: String, $cursor: String) {
    getFolders(folder_id: $folder_id, cursor: $cursor) {
      folders {
        id
        name
        folder_id
        created_at
        updated_at
      }
      has_more
    }
  }
`;

export default GET_FOLDERS;
