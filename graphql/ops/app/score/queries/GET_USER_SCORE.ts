import { gql } from "@apollo/client";

const GET_USER_SCORE = gql`
  query GET_USER_SCORE {
    getUserScore
  }
`;

export default GET_USER_SCORE;