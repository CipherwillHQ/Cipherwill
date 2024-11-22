import { gql } from "@apollo/client";

const UPDATE_FACTOR = gql`
  mutation UPDATE_FACTOR($id: String!, $name: String!) {
    updateFactor(id: $id, name: $name) {
      id
      name
      updated_at
    }
  }
`;

export default UPDATE_FACTOR;
