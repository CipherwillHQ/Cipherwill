import { gql } from "@apollo/client";

const DELETE_FACTOR = gql`
  mutation DELETE_FACTOR($id: String!) {
    deleteFactor(id: $id) {
      id
    }
  }
`;

export default DELETE_FACTOR;
