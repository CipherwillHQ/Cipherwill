// Requests segment counts for items shared through an executor access record.
// Owns access-scoped category counts across all folders and pages.
// Does not load item contents or calculate beneficiary permissions.

import { gql } from "@apollo/client";

const GET_GRANTED_METAMODEL_TYPE_COUNTS = gql`
  query GET_GRANTED_METAMODEL_TYPE_COUNTS($access_id: ID!) {
    getGrantedMetamodelTypeCounts(access_id: $access_id) {
      type
      count
    }
  }
`;

export default GET_GRANTED_METAMODEL_TYPE_COUNTS;
