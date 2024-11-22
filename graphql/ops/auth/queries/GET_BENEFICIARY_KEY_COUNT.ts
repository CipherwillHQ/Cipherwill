import { gql } from "@apollo/client";

const GET_BENEFICIARY_KEY_COUNT = gql`
  query GET_BENEFICIARY_KEY_COUNT {
    getBeneficiaryKeyCount {
      beneficiary_id
      factor_wise_count {
        publicKey
        count
      }
    }
  }
`;

export default GET_BENEFICIARY_KEY_COUNT;
