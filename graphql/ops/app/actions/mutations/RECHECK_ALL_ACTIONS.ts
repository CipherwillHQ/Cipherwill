import { gql } from "@apollo/client";

const RECHECK_ALL_ACTIONS = gql`
  mutation RECHECK_ALL_ACTIONS {
    recheckAllActions
  }
`;

export default RECHECK_ALL_ACTIONS;