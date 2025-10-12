import { gql } from "@apollo/client";

const GET_METAMODEL_TYPE_COUNTS = gql`
  query GET_METAMODEL_TYPE_COUNTS {
    getMetamodelTypeCounts {
      type
      count
    }
  }
`;

export default GET_METAMODEL_TYPE_COUNTS;