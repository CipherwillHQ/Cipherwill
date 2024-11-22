import { gql } from "@apollo/client";

const DELETE_POD = gql`
  mutation DELETE_POD($ref_id: ID!) {
    deletePod(ref_id: $ref_id)
  }
`;

export default DELETE_POD;
