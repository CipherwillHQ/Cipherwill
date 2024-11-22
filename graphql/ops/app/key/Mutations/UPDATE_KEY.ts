import { gql } from "@apollo/client";

const UPDATE_KEY = gql`
  mutation UPDATE_KEY($items: [KeyInput!]!) {
    updateKey(items: $items)
  }
`;

export default UPDATE_KEY;
