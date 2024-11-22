import { gql } from "@apollo/client";

const GET_MY_KEY_COUNT = gql`
  query GET_MY_KEY_COUNT {
    getMyKeyCount {
      publicKey
      count
    }
  }
`;

export default GET_MY_KEY_COUNT;
