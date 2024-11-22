import { gql } from "@apollo/client";

const RESET_WILL_EVENTS = gql`
  mutation RESET_WILL_EVENTS {
    resetWillEvents
  }
`;

export default RESET_WILL_EVENTS;
