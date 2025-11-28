import { gql } from "@apollo/client";

const GET_PREFERENCES = gql`
  query GET_PREFERENCES {
    getPreferences {
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

      first_reminder_after_ms
      second_reminder_after_ms
      last_reminder_after_ms
      will_release_after_ms
      will_revoke_after_ms

      created_at
      updated_at
    }
  }
`;

export default GET_PREFERENCES;
