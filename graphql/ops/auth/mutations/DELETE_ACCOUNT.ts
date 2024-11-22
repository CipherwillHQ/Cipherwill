import { gql } from "@apollo/client";

const DELETE_ACCOUNT = gql`
  mutation DELETE_ACCOUNT {
    deleteAccount
  }
`;

export default DELETE_ACCOUNT;
