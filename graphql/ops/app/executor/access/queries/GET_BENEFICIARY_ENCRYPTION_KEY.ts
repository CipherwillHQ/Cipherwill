import { gql } from "@apollo/client";

const GET_BENEFICIARY_ENCRYPTION_KEY = gql`
  query GET_BENEFICIARY_ENCRYPTION_KEY($access_id: ID!) {
    getBeneficiaryEncryptionKey(access_id: $access_id)
  }
`;

export default GET_BENEFICIARY_ENCRYPTION_KEY;