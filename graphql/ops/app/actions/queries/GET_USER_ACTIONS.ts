import { gql } from "@apollo/client";

const GET_USER_ACTIONS = gql`
  query GET_USER_ACTIONS {
    getUserActions {
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

export default GET_USER_ACTIONS;