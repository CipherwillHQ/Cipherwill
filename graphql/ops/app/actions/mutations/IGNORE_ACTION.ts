import { gql } from "@apollo/client";

const IGNORE_ACTION = gql`
  mutation IGNORE_ACTION($action_id: ID!) {
    ignoreAction(action_id: $action_id) {
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

export default IGNORE_ACTION;