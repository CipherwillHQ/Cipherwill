// Defines the browser engine's initial account read and final-save mutation.
// Owns network contracts that exclude draft and decrypted asset context.
// Does not fetch or advance guidance questions.
import { gql } from "@apollo/client";

export const GET_GUIDED_ASSET_COUNTS = gql`
  query GET_GUIDED_ASSET_COUNTS { getGuidedAssetCounts }
`;

export const GET_GUIDANCE_ACCOUNT = gql`
  query GET_GUIDANCE_ACCOUNT {
    getGuidedActionRecovery
    getGuidedObjectiveCatalog
    getGuidedActionCompletions
    getGuidedActionDeferrals { objectiveId resumeAfter dismissed }
    me { first_name last_name birth_date plan }
    getPreferences {
      id
      segment_bank_account segment_email_accounts segment_device_locks segment_passwords
      segment_seed_phrases segment_defi_staking segment_payment_cards segment_storage
    }
    getSmartWillBeneficiaries { id }
  }
`;

export const DEFER_GUIDED_OBJECTIVE = gql`
  mutation DEFER_GUIDED_OBJECTIVE($objectiveId: String!, $dismiss: Boolean!) {
    deferGuidedAction(objectiveId: $objectiveId, dismiss: $dismiss) { objectiveId resumeAfter dismissed }
  }
`;

export const RESUME_GUIDED_OBJECTIVE = gql`
  mutation RESUME_GUIDED_OBJECTIVE($objectiveId: String!) { resumeGuidedAction(objectiveId: $objectiveId) }
`;

export const COMPLETE_GUIDED_OBJECTIVE = gql`
  mutation COMPLETE_GUIDED_OBJECTIVE($objectiveId: String!, $answers: JSON!, $version: Int) {
    completeGuidedObjective: completeGuidedAction(objectiveId: $objectiveId, answers: $answers, version: $version) {
      status
      beneficiaryPersonId
      data
      recovery
    }
  }
`;

export const FINISH_GUIDED_OPERATION = gql`
  mutation FINISH_GUIDED_OPERATION($objectiveId: String!, $actionId: String!) {
    finishGuidedActionOperation(objectiveId: $objectiveId, actionId: $actionId)
  }
`;
