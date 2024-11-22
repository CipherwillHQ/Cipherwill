import { gql } from "@apollo/client";

const GET_NEXT_WILL_EVENT = gql`
  query GET_NEXT_WILL_EVENT {
    getNextWillEvent {
      id
      type
      execution_time
      created_at
    }
  }
`;

export default GET_NEXT_WILL_EVENT;
