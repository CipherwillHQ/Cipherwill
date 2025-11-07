import { gql } from "@apollo/client";

const GET_GRANTED_STORAGE_OBJECT_DOWNLOAD_URL = gql`
  query GET_GRANTED_STORAGE_OBJECT_DOWNLOAD_URL($access_id: ID!, $ref_id: ID!) {
    getGrantedStorageObjectDownloadUrl(access_id: $access_id, ref_id: $ref_id)
  }
`;

export default GET_GRANTED_STORAGE_OBJECT_DOWNLOAD_URL;