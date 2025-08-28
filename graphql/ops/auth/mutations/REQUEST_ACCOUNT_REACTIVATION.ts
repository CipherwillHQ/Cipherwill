import { gql } from "@apollo/client";

const REQUEST_ACCOUNT_REACTIVATION = gql`
  mutation REQUEST_ACCOUNT_REACTIVATION {
    requestAccountReactivation
  }
`;

export default REQUEST_ACCOUNT_REACTIVATION;
