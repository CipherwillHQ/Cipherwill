import { gql } from "@apollo/client";

const GET_GRANTED_POD = gql`
  query GET_GRANTED_POD($access_id: ID!, $ref_id: ID!) {
    getGrantedPod(access_id: $access_id, ref_id: $ref_id) {
      id
      ref_id
      mime_type
      encoding
      content
      size
      created_at
      updated_at
    }
  }
`;

export default GET_GRANTED_POD;
