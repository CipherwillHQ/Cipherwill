
import { gql } from "@apollo/client";

const UPDATE_CUSTOM_MESSAGE_FOR_BENEFICIARY = gql`
  mutation UPDATE_CUSTOM_MESSAGE_FOR_BENEFICIARY($beneficiary_id: String!, $custom_message: String) {
    updateCustomMessageForBeneficiary(beneficiary_id: $beneficiary_id, custom_message: $custom_message)
  }
`;

export default UPDATE_CUSTOM_MESSAGE_FOR_BENEFICIARY;