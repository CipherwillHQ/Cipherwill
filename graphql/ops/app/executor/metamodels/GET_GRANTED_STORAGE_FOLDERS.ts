import { gql } from "@apollo/client";

const GET_GRANTED_STORAGE_FOLDERS = gql`
  query GET_GRANTED_STORAGE_FOLDERS(
    $access_id: ID!
    $cursor: String
    $folder_id: String
  ) {
    getGrantedStorageFolders(
      access_id: $access_id
      cursor: $cursor
      folder_id: $folder_id
    ) {
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

export default GET_GRANTED_STORAGE_FOLDERS;
