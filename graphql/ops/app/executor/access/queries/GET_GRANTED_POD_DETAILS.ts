import { gql } from "@apollo/client";

const GET_GRANTED_POD_DETAILS = gql`
  query GET_GRANTED_POD_DETAILS($access_id: ID!, $ref_id: ID!) {
    getGrantedPod(access_id: $access_id, ref_id: $ref_id) {
      id
      ref_id
      mime_type
      size
      created_at
      updated_at
    }
  }
`;

export default GET_GRANTED_POD_DETAILS;
