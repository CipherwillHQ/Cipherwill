import { gql } from "@apollo/client";

const COMPLETED_POD_UPLOAD = gql`
  mutation completedPodUpload($ref_id: ID!) {
    completedPodUpload(ref_id: $ref_id)
  }
`;

export default COMPLETED_POD_UPLOAD;