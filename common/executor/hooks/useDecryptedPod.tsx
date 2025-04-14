import { useSession } from "@/contexts/SessionContext";
import GET_BENEFICIARY_ENCRYPTION_KEY from "@/graphql/ops/app/executor/access/queries/GET_BENEFICIARY_ENCRYPTION_KEY";
import GET_KEY_BY_REF_ID from "@/graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import { useApolloClient, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import get_pod_decryption_key from "../data/get_pod_decryption_key";
import GET_POD from "@/graphql/ops/app/pod/queries/GET_POD";
import CryptoJS from "crypto-js";
import logger from "@/common/debug/logger";

export default async function useDecryptedPod({
  access_id,
  metamodel_id,
  setData,
  setKeyMetadata,
}: {
  access_id: string;
  metamodel_id: string;
  setData: (data) => void;
  setKeyMetadata: (data) => void;
}) {
  const { session } = useSession();
  const client = useApolloClient();
  useQuery(GET_KEY_BY_REF_ID, {
    fetchPolicy: "network-only",
    variables: {
      ref_id: metamodel_id,
      publicKey: session ? session.publicKey : null,
    },
    onCompleted: async (data) => {
      setKeyMetadata(data.getKeyByRefId);
      if (data && data.getKeyByRefId) {
        // get time capsule private key to decrypt data
        const { data: beneficairy_encryption_key } = await client.query({
          query: GET_BENEFICIARY_ENCRYPTION_KEY,
          variables: {
            id: access_id,
          },
        });
        if (!beneficairy_encryption_key.getBeneficiaryEncryptionKey) {
          toast.error("You do not have access key to decrypt this data");
          return;
        }
        const encrypted_nonce_key = data.getKeyByRefId.key;
        const pod_decryption_key = await get_pod_decryption_key({
          encrypted_key: encrypted_nonce_key,
          time_capsule_private_key:
            beneficairy_encryption_key.getBeneficiaryEncryptionKey,
          current_session_private_key: session ?session.privateKey : null,
        });
        let pod;
        try {
          pod = await client.query({
            query: GET_POD,
            fetchPolicy: "network-only",
            variables: {
              ref_id: metamodel_id,
            },
          });
        } catch (error) {
          if (error.graphQLErrors[0].extensions.code === "POD_NOT_FOUND") {
            return;
          } else {
            throw error;
          }
        }
        if (!pod) return;
        const content = pod.data.getPod.content;
        const final_content = JSON.parse(
          CryptoJS.AES.decrypt(content, pod_decryption_key).toString(
            CryptoJS.enc.Utf8
          )
        );
        if (final_content.type) {
          setData(final_content.data);
        }
      } else {
        logger.error("You do not have access to this data");
      }
      if (data && data.getKeyByRefId === null) {
        logger.error("You do not have access to this data");
      }
    },
  });
  return null;
}
