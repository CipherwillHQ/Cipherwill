import { gql } from "@apollo/client";

const UPSERT_KEYS = gql`
  mutation UPSERT_KEYS($items: [KeyInput!]!) {
    upsertKeys(items: $items)
  }
`;

export default UPSERT_KEYS;
