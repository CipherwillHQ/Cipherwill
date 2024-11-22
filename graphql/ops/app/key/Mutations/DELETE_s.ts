
import { gql } from "@apollo/client";

const DELETE_ALL_KEYS_FOR_BENEFICIARY = gql`
  mutation DELETE_ALL_KEYS_FOR_BENEFICIARY($beneficiary_id: String!) {
    deleteAllKeysForBeneficiary(beneficiary_id: $beneficiary_id)
  }
`;

export default DELETE_ALL_KEYS_FOR_BENEFICIARY;
