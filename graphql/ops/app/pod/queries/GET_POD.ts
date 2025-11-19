import { gql } from "@apollo/client";

const GET_POD = gql`
  query GET_POD($ref_id: ID!) {
    getPod(ref_id: $ref_id) {
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

export default GET_POD;
