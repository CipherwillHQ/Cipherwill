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
      created_at
      updated_at
    }
  }
`;

export default GET_PREFERENCES;
