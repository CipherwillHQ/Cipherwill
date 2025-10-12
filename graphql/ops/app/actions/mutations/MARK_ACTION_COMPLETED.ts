import { gql } from "@apollo/client";

const MARK_ACTION_COMPLETED = gql`
  mutation MARK_ACTION_COMPLETED($action_id: ID!) {
    markActionCompleted(action_id: $action_id)
  }
`;

export default MARK_ACTION_COMPLETED;