import { gql } from "@apollo/client";

const REVOKE_ACCESS_TO_MY_WILL = gql`
  mutation REVOKE_ACCESS_TO_MY_WILL($id: ID!) {
    revokeAccessToMyWill(id: $id)
  }
`;

export default REVOKE_ACCESS_TO_MY_WILL;