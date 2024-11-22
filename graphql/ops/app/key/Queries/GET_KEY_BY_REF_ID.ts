import { gql } from "@apollo/client";

const GET_KEY_BY_REF_ID = gql`
  query GET_KEY_BY_REF_ID($ref_id: ID!, $publicKey: String) {
    getKeyByRefId(ref_id: $ref_id, publicKey: $publicKey) {
      id
      ref_id
      publicKey
      key
      created_at
      updated_at
    }
  }
`;

export default GET_KEY_BY_REF_ID;
