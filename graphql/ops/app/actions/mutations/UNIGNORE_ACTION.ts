import { gql } from "@apollo/client";

const UNIGNORE_ACTION = gql`
  mutation UNIGNORE_ACTION($action_id: ID!) {
    unignoreAction(action_id: $action_id) {
      id
      action
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

export default UNIGNORE_ACTION;