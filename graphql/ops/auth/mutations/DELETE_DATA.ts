import { gql } from "@apollo/client";

const DELETE_DATA = gql`
  mutation DELETE_DATA {
    deleteData
  }
`;

export default DELETE_DATA;
