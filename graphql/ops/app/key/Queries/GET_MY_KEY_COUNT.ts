// Defines owner key counts with optional storage-file exclusion.
// Owns the backup-only filter while preserving general count requests.
// Does not select a session factor or fetch key contents.

import { gql } from "@apollo/client";

const GET_MY_KEY_COUNT = gql`
  query GET_MY_KEY_COUNT($exclude_files: Boolean) {
    getMyKeyCount(exclude_files: $exclude_files) {
      publicKey
      count
    }
  }
`;

export default GET_MY_KEY_COUNT;
