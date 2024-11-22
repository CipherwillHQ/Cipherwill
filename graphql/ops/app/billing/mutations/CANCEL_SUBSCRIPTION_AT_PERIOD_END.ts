import { gql } from "@apollo/client";

const CANCEL_SUBSCRIPTION_AT_PERIOD_END = gql`
  mutation CANCEL_SUBSCRIPTION_AT_PERIOD_END($subscriptionId: ID!) {
    cancelSubscriptionAtPeriodEnd(subscriptionId: $subscriptionId)
  }
`;

export default CANCEL_SUBSCRIPTION_AT_PERIOD_END;
