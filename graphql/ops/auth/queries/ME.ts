import { gql } from "@apollo/client";

const ME = gql`
  query ME {
    me {
      id
      email
      email_verified
      first_name
      middle_name
      last_name
      birth_date
      gender
      country
      plan
      last_accessed
      created_at
      updated_at
    }
  }
`;

export default ME;
