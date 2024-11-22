import { gql } from "@apollo/client";

const GET_INVOICE_PDF = gql`
  query GET_INVOICE_PDF($invoiceId: ID!) {
    getInvoicePdf(invoiceId: $invoiceId)
  }
`;

export default GET_INVOICE_PDF;
