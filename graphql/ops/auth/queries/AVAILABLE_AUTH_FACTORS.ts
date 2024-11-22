import { gql } from "@apollo/client";

const GET_FACTORS = gql`
  query GET_FACTORS {
    getFactors {
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

export default GET_FACTORS;
