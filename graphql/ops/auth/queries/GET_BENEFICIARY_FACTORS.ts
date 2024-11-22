import { gql } from "@apollo/client";

const GET_BENEFICIARY_FACTORS = gql`
  query GET_BENEFICIARY_FACTORS {
    getBeneficiaryFactors {
      beneficiary_id
      publicKey
      factors {
        id
        name
        type
        publicKey
        created_at
        updated_at
      }
    }
  }
`;

export default GET_BENEFICIARY_FACTORS;
