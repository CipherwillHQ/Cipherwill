import { gql } from "@apollo/client";

const GET_ALL_BENEFICIARY_ACCESS = gql`
  query GET_ALL_BENEFICIARY_ACCESS {
    getAllBeneficiaryAccess {
      id
      user
      created_at
      expire_at
    }
  }
`;

export default GET_ALL_BENEFICIARY_ACCESS;