import { gql } from "@apollo/client";

const GET_BENEFICIARY_ENCRYPTION_KEY = gql`
  query GET_BENEFICIARY_ENCRYPTION_KEY($id: ID!) {
    getBeneficiaryEncryptionKey(id: $id)
  }
`;

export default GET_BENEFICIARY_ENCRYPTION_KEY;