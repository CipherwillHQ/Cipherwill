// Requests the size needed for the file details page.
// Owns the metadata-only pod query.
// Does not request encrypted contents or download a file.
import { gql } from "@apollo/client";

const GET_POD_SIZE = gql`
  query GET_POD_SIZE($ref_id: ID!) {
    getPod(ref_id: $ref_id) {
      size
    }
  }
`;

export default GET_POD_SIZE;
