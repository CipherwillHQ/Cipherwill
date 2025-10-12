import { gql } from "@apollo/client";

const GET_COMPLETED_ACTIONS = gql`
  query GET_COMPLETED_ACTIONS {
    getCompletedActions {
      id
      action
      description
      variable
      condition
      value
      created_at
      completion_key
      completed_at
      ignored_at
    }
  }
`;

export default GET_COMPLETED_ACTIONS;