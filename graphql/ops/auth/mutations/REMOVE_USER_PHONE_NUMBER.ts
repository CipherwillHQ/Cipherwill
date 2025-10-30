import { gql } from "@apollo/client";

const REMOVE_USER_PHONE_NUMBER = gql`
  mutation REMOVE_USER_PHONE_NUMBER($id: ID!) {
    removeUserPhoneNumber(id: $id)
  }
`;

export default REMOVE_USER_PHONE_NUMBER;