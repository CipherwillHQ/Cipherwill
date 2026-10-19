// Requests item counts for one beneficiary across every segment.
// Owns the beneficiary filter passed to the segment count API.
// Does not load item contents or calculate permissions in the browser.

import { gql } from "@apollo/client";

const GET_BENEFICIARY_SEGMENT_COUNTS = gql`
  query GET_BENEFICIARY_SEGMENT_COUNTS($beneficiary_id: ID!) {
    getMetamodelTypeCounts(beneficiary_id: $beneficiary_id) {
      type
      count
    }
  }
`;

export default GET_BENEFICIARY_SEGMENT_COUNTS;
