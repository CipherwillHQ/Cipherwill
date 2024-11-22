
import { gql } from "@apollo/client";

const CANCEL_SUBSCRIPTION_NOW_AND_REFUND = gql`
  mutation CANCEL_SUBSCRIPTION_NOW_AND_REFUND($subscriptionId: ID!) {
    cancelSubscriptionNowAndRefund(subscriptionId: $subscriptionId)
  }
`;

export default CANCEL_SUBSCRIPTION_NOW_AND_REFUND;
