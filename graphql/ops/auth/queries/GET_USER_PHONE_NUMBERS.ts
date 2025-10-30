import { gql } from "@apollo/client";

const GET_USER_PHONE_NUMBERS = gql`
  query GET_USER_PHONE_NUMBERS {
    getUserPhoneNumbers {
      id
      phone_code
      phone_num
      verified
      created_at
      updated_at
    }
  }
`;

export default GET_USER_PHONE_NUMBERS;