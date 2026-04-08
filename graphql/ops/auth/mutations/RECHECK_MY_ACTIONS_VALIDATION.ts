import { gql } from "@apollo/client";

const RECHECK_MY_ACTIONS_VALIDATION = gql`
  mutation RECHECK_MY_ACTIONS_VALIDATION {
    recheckMyActionsValidation
  }
`;

export default RECHECK_MY_ACTIONS_VALIDATION;
