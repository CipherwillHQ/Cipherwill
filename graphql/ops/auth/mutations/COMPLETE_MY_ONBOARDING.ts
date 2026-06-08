/**
 * Saves onboarding responses and marks onboarding as completed.
 * This is intentionally separate from profile or preferences mutations.
 */
import { gql } from "@apollo/client";

const COMPLETE_MY_ONBOARDING = gql`
  mutation COMPLETE_MY_ONBOARDING($data: CompleteMyOnboardingInput!) {
    completeMyOnboarding(data: $data) {
      user_id
      is_completed
      heard_from_option_id
      heard_from_custom
      expectations_selected_ids
      expectations_custom
      completed_at
      updated_at
    }
  }
`;

export default COMPLETE_MY_ONBOARDING;
