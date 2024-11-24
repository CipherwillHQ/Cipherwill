import { gql } from "@apollo/client";

const GET_PADDLE_PORTAL_SESSION_URL = gql`
  query GET_PADDLE_PORTAL_SESSION_URL($subscription_id: String!) {
    getPaddlePortalSessionUrl(subscription_id: $subscription_id)
  }
`;

export default GET_PADDLE_PORTAL_SESSION_URL;
