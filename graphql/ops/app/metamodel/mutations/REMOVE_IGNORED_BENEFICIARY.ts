import { gql } from "@apollo/client";

const REMOVE_IGNORED_BENEFICIARY = gql`
  mutation REMOVE_IGNORED_BENEFICIARY($metamodel_id: ID!, $beneficiary_id: ID!) {
    removeIgnoredBeneficiary(metamodel_id: $metamodel_id, beneficiary_id: $beneficiary_id) {
      id
      type
      metadata
      ignored_beneficiaries
      created_at
      updated_at
    }
  }
`;

export default REMOVE_IGNORED_BENEFICIARY;