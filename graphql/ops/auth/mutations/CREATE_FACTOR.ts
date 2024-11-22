import { gql } from "@apollo/client";

const CREATE_FACTOR = gql`
  mutation CREATE_FACTOR(
    $name: String!
    $type: String!
    $publicKey: String!
    $nonce: String!
  ) {
    createFactor(
      name: $name
      type: $type
      publicKey: $publicKey
      nonce: $nonce
    ) {
      id
      name
      type
      publicKey
      nonce
      created_at
      updated_at
    }
  }
`;

export default CREATE_FACTOR;
