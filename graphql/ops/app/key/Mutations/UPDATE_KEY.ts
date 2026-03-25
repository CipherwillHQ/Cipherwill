import { gql } from "@apollo/client";

const UPDATE_KEY = gql`
  mutation UPDATE_KEY($items: [KeyInput!]!, $operation_id: String) {
    updateKey(items: $items, operation_id: $operation_id)
  }
`;

export default UPDATE_KEY;
