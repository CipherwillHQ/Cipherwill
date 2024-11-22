import { gql } from "@apollo/client";

const GET_ACCESS_DETAILS = gql`
  query GET_ACCESS_DETAILS($id: ID!) {
    getAccessDetails(id: $id) {
      id
      user
      created_at
      expire_at
    }
  }
`;

export default GET_ACCESS_DETAILS;