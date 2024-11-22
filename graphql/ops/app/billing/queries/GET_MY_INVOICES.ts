import { gql } from "@apollo/client";

const GET_MY_INVOICES = gql`
  query GET_MY_INVOICES {
    getMyInvoices {
      id
      plan_name
      status
      amount
      currency
      created_at
      updated_at
    }
  }
`;

export default GET_MY_INVOICES;
