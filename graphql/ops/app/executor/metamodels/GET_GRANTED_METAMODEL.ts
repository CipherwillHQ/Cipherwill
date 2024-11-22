import { gql } from "@apollo/client";

const GET_GRANTED_METAMODEL = gql`
  query GET_GRANTED_METAMODEL($access_id: ID!, $model_id: ID!) {
    getGrantedMetamodel(access_id: $access_id, model_id: $model_id) {
      id
      type
      metadata
      created_at
      updated_at
    }
  }
`;

export default GET_GRANTED_METAMODEL;
