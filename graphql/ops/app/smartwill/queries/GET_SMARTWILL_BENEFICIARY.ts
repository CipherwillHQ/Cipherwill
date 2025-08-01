import { gql } from "@apollo/client";

const GET_SMARTWILL_BENEFICIARY = gql`
  query GET_SMARTWILL_BENEFICIARY {
    getSmartWillBeneficiaries {
      id
      user_id
      person_id
      publicKey
      custom_message
    }
  }
`;

export default GET_SMARTWILL_BENEFICIARY;
