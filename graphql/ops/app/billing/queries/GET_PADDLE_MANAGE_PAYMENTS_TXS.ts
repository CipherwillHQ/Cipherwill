import { gql } from "@apollo/client";

const GET_PADDLE_MANAGE_PAYMENTS_TXS = gql`
  query GET_PADDLE_MANAGE_PAYMENTS_TXS($subscriptionId: ID!) {
    getPaddleManagePaymentsTxs(subscriptionId: $subscriptionId)
  }
`;

export default GET_PADDLE_MANAGE_PAYMENTS_TXS;
