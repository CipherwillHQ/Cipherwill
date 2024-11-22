import { gql } from "@apollo/client";

const GET_STORAGE_USED = gql`
  query GET_STORAGE_USED {
    getStorageUsed {
      id
      text_pods
      storage_pods
    }
  }
`;

export default GET_STORAGE_USED;
