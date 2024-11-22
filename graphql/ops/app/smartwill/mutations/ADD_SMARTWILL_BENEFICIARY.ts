import { gql } from "@apollo/client";

const ADD_SMARTWILL_BENEFICIARY = gql`
  mutation ADD_SMARTWILL_BENEFICIARY($id: String!) {
    addSmartWillBeneficiary(id: $id)
  }
`;

export default ADD_SMARTWILL_BENEFICIARY;