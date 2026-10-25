// Reads the account facts shown on the guide's opening overview slide.
// Owns one count/profile/score query using existing GraphQL fields.
// Does not request encrypted content, credentials, or private keys.
import { gql } from "@apollo/client";

export const GET_GUIDANCE_OVERVIEW = gql`
  query GET_GUIDANCE_OVERVIEW {
    getUserScore
    me { first_name email_verified }
    getMetamodelTypeCounts { type count }
    getSmartWillBeneficiaries { id }
    getFactors { id }
    getAllKeyCount { publicKey count }
  }
`;
