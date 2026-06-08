/**
 * Reads onboarding status, answer options, and saved selections for the current user.
 * Used by the /app onboarding guard and the onboarding flow page.
 */
import { gql } from "@apollo/client";

const GET_MY_ONBOARDING = gql`
  query GET_MY_ONBOARDING {
    getMyOnboarding {
      user_id
      is_completed
      heard_from_option_id
      heard_from_custom
      expectations_selected_ids
      expectations_custom
      heard_from_options_catalog {
        id
        label
        requires_custom_text
      }
      expectation_options_catalog {
        id
        label
        requires_custom_text
      }
      completed_at
      created_at
      updated_at
    }
  }
`;

export default GET_MY_ONBOARDING;
