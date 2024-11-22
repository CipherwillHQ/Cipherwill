import { gql } from "@apollo/client";

const DELETE_KEY_BY_PUBLIC_KEY = gql`
  mutation DELETE_KEY_BY_PUBLIC_KEY($publicKey: String!) {
    deleteKeyForPublicKey(publicKey: $publicKey)
  }
`;

export default DELETE_KEY_BY_PUBLIC_KEY;
