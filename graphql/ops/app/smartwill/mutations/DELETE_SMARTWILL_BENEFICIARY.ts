import { gql } from "@apollo/client";

const DELETE_SMARTWILL_BENEFICIARY = gql`
  mutation DELETE_SMARTWILL_BENEFICIARY($id: String!) {
    deleteSmartWillBeneficiary(id: $id)
  }
`;

export default DELETE_SMARTWILL_BENEFICIARY;