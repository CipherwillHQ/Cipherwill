import { gql } from "@apollo/client";

const UPDATE_MOBILE_PREFERENCES = gql`
  mutation UPDATE_MOBILE_PREFERENCES($id: ID!, $key: String!, $value: Boolean!) {
    updateMobilePreferences(id: $id, key: $key, value: $value) {
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

export default UPDATE_MOBILE_PREFERENCES;