import { gql } from "@apollo/client";

const ADD_IGNORED_BENEFICIARY = gql`
  mutation ADD_IGNORED_BENEFICIARY($metamodel_id: ID!, $beneficiary_id: ID!) {
    addIgnoredBeneficiary(metamodel_id: $metamodel_id, beneficiary_id: $beneficiary_id) {
      id
      type
      metadata
      ignored_beneficiaries
      created_at
      updated_at
    }
  }
`;

export default ADD_IGNORED_BENEFICIARY;