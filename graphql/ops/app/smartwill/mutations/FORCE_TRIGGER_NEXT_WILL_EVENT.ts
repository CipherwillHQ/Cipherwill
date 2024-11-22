import { gql } from "@apollo/client";

const FORCE_TRIGGER_NEXT_WILL_EVENT = gql`
  mutation FORCE_TRIGGER_NEXT_WILL_EVENT {
    forceTriggerNextWillEvent
  }
`;

export default FORCE_TRIGGER_NEXT_WILL_EVENT;
