import { gql } from "@apollo/client";

const UPDATE_USER = gql`
  mutation UPDATE_USER($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      email
      first_name
      middle_name
      last_name
      birth_date
      gender
      country
      address_line1
      address_line2
      city
      state
      postal_code
      created_at
      updated_at
    }
  }
`;

export default UPDATE_USER;