import { gql } from "@apollo/client";

const GET_MY_SUBSCRIPTION = gql`
  query GET_MY_SUBSCRIPTION {
    getMySubscription {
      id
      payment_gateway
      plan_name
      status
      next_billing_at
      last_payment_method
      created_at
      updated_at
      cancel_at
    }
  }
`;

export default GET_MY_SUBSCRIPTION;
