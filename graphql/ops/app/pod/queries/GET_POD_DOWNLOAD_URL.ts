import { gql } from "@apollo/client";

const GET_POD_DOWNLOAD_URL = gql`
  query getPodDownloadUrl($ref_id: ID!) {
    getPodDownloadUrl(ref_id: $ref_id)
  }
`;

export default GET_POD_DOWNLOAD_URL;