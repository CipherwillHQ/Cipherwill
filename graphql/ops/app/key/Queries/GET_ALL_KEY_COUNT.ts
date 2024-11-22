import { gql } from "@apollo/client";

const GET_ALL_KEY_COUNT = gql`
  query GET_ALL_KEY_COUNT {
    getAllKeyCount {
      publicKey
      count
    }
  }
`;

export default GET_ALL_KEY_COUNT;
