import { gql } from "@apollo/client";

const GET_USER_PHONE_NUMBERS = gql`
  query GET_USER_PHONE_NUMBERS {
    getUserPhoneNumbers {
      id
      phone_code
      phone_num
      verified

      mandatory_phone_calls
      mandatory_sms
      mandatory_whatsapp

      promotional_phone_calls
      promotional_sms
      promotional_whatsapp

      created_at
      updated_at
    }
  }
`;

export default GET_USER_PHONE_NUMBERS;