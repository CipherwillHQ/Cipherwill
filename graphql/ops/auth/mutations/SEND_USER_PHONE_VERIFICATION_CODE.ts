import { gql } from "@apollo/client";

const SEND_USER_PHONE_VERIFICATION_CODE = gql`
  mutation SEND_USER_PHONE_VERIFICATION_CODE($id: ID!) {
    sendUserPhoneVerificationCode(id: $id)
  }
`;

export default SEND_USER_PHONE_VERIFICATION_CODE;