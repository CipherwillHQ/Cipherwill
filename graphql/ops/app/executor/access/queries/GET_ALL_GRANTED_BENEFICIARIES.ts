import { gql } from "@apollo/client";

const GET_ALL_GRANTED_BENEFICIARIES = gql`
  query GET_ALL_GRANTED_BENEFICIARIES {
    getAllGrantedBeneficiaries {
      id
      user
      created_at
      expire_at
    }
  }
`;

export default GET_ALL_GRANTED_BENEFICIARIES;