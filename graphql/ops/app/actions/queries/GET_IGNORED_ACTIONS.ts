import { gql } from "@apollo/client";

const GET_IGNORED_ACTIONS = gql`
  query GET_IGNORED_ACTIONS {
    getIgnoredActions {
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

export default GET_IGNORED_ACTIONS;