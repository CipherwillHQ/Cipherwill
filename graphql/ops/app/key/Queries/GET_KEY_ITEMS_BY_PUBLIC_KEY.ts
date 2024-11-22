import { gql } from "@apollo/client";

const GET_KEY_ITEMS_BY_PUBLIC_KEY = gql`
  query GET_KEY_ITEMS_BY_PUBLIC_KEY($publicKey: String!, $cursor: String, $for_beneficiary_migration: Boolean) {
    getKeyItemsByPublicKey(publicKey: $publicKey, cursor: $cursor, for_beneficiary_migration: $for_beneficiary_migration) {
      items {
        id
        ref_id
        publicKey
        key
        beneficiary_id
        created_at
        updated_at
      }
      has_more
    }
  }
`;

export default GET_KEY_ITEMS_BY_PUBLIC_KEY;
