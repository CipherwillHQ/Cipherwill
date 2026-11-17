import { gql } from "@apollo/client";

const GET_CHECKOUT_ELIGIBILITY = gql`
  query GET_CHECKOUT_ELIGIBILITY {
    getCheckoutEligibility {
      allowed
      status
      reason
    }
  }
`;

export default GET_CHECKOUT_ELIGIBILITY;
