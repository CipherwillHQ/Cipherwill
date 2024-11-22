import { gql } from "@apollo/client";

const DELETE_SMARTWILL_FRIEND = gql`
  mutation DELETE_SMARTWILL_FRIEND($id: String!) {
    deleteSmartWillFriend(id: $id)
  }
`;

export default DELETE_SMARTWILL_FRIEND;