// Requests the owner's beneficiary records.
// Owns the fields needed for beneficiary management and detail pages.
// Does not resolve people or calculate segment access.

import { gql } from "@apollo/client";

const GET_SMARTWILL_BENEFICIARY = gql`
  query GET_SMARTWILL_BENEFICIARY {
    getSmartWillBeneficiaries {
      id
      user_id
      person_id
      publicKey
      custom_message
      created_at
    }
  }
`;

export default GET_SMARTWILL_BENEFICIARY;
