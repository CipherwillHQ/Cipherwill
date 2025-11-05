import { gql } from "@apollo/client";

const ADD_USER_PHONE_NUMBER = gql`
  mutation ADD_USER_PHONE_NUMBER($phone_code: String!, $phone_num: String!) {
    addUserPhoneNumber(phone_code: $phone_code, phone_num: $phone_num)
  }
`;

export default ADD_USER_PHONE_NUMBER;