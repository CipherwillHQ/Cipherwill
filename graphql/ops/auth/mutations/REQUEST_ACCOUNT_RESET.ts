
import { gql } from "@apollo/client";

const REQUEST_ACCOUNT_RESET = gql`
  mutation REQUEST_ACCOUNT_RESET {
    requestAccountReset
  }
`;

export default REQUEST_ACCOUNT_RESET;
