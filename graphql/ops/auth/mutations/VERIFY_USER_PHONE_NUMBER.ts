import { gql } from "@apollo/client";

const VERIFY_USER_PHONE_NUMBER = gql`
  mutation VERIFY_USER_PHONE_NUMBER($id: ID!, $otp: String!) {
    verifyUserPhoneNumber(id: $id, otp: $otp)
  }
`;

export default VERIFY_USER_PHONE_NUMBER;