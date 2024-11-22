import { gql } from "@apollo/client";

const ADD_SMARTWILL_FRIEND = gql`
  mutation ADD_SMARTWILL_FRIEND($id: String!) {
    addSmartWillFriend(id: $id)
  }
`;

export default ADD_SMARTWILL_FRIEND;