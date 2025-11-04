import { gql } from "@apollo/client";

const UPDATE_PREFERENCES = gql`
  mutation UPDATE_PREFERENCES($key: String!, $value: String!) {
    updateUserPreferences(key: $key, value: $value) {
      id
      check_in_interval
      segment_bank_account
      segment_email_accounts
      segment_device_locks
      segment_passwords
      segment_seed_phrases
      segment_defi_staking
      segment_payment_cards
      segment_storage
      promotional_emails
      created_at
      updated_at
    }
  }
`;

export default UPDATE_PREFERENCES;
