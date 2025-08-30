import { useSession } from "@/contexts/SessionContext";
import GET_BENEFICIARY_ENCRYPTION_KEY from "@/graphql/ops/app/executor/access/queries/GET_BENEFICIARY_ENCRYPTION_KEY";
import GET_KEY_BY_REF_ID from "@/graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import get_pod_decryption_key from "../data/get_pod_decryption_key";
import GET_POD from "@/graphql/ops/app/pod/queries/GET_POD";
import CryptoJS from "crypto-js";
import logger from "@/common/debug/logger";
import type {
  GetKeyByRefIdQuery,
  GetKeyByRefIdVariables,
  GetBeneficiaryEncryptionKeyQuery,
  GetBeneficiaryEncryptionKeyVariables,
  GetPodQuery,
  GetPodVariables
} from "@/types/interfaces/metamodel";

export default function useDecryptedPod({
  access_id,
  metamodel_id,
  setData,
  setKeyMetadata,
}: {
  access_id: string;
  metamodel_id: string;
  setData: (data: any) => void;
  setKeyMetadata: (data: any) => void;
}) {
  const { session } = useSession();
  const client = useApolloClient();
  
  const { data, loading, error } = useQuery<GetKeyByRefIdQuery, GetKeyByRefIdVariables>(GET_KEY_BY_REF_ID, {
    fetchPolicy: "network-only",
    variables: {
      ref_id: metamodel_id,
      publicKey: session ? session.publicKey : "",
    },
  });

  useEffect(() => {
    const processData = async () => {
      if (data && data.getKeyByRefId) {
        setKeyMetadata(data.getKeyByRefId);
        
        // get time capsule private key to decrypt data
        try {
          const { data: beneficiaryEncryptionKeyResponse } = await client.query<
            GetBeneficiaryEncryptionKeyQuery,
            GetBeneficiaryEncryptionKeyVariables
          >({
            query: GET_BENEFICIARY_ENCRYPTION_KEY,
            variables: {
              id: access_id,
            },
          });
          
          if (!beneficiaryEncryptionKeyResponse?.getBeneficiaryEncryptionKey) {
            toast.error("You do not have access key to decrypt this data");
            return;
          }
          
          const encrypted_nonce_key = data.getKeyByRefId.key;
          const pod_decryption_key: any = await get_pod_decryption_key({
            encrypted_key: encrypted_nonce_key,
            time_capsule_private_key:
              beneficiaryEncryptionKeyResponse.getBeneficiaryEncryptionKey,
            current_session_private_key: session ? session.privateKey : null,
          });
          let pod;
          try {
            pod = await client.query<GetPodQuery, GetPodVariables>({
              query: GET_POD,
              fetchPolicy: "network-only",
              variables: {
                ref_id: metamodel_id,
              },
            });
          } catch (error: any) {
            if (error.graphQLErrors?.[0]?.extensions?.code === "POD_NOT_FOUND") {
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
        } catch (error) {
          logger.error("Error processing pod data:", error);
        }
      } else if (data && data.getKeyByRefId === null) {
        logger.error("You do not have access to this data");
      }
    };

    if (data) {
      processData();
    }
  }, [data, access_id, metamodel_id, setData, setKeyMetadata, session, client]);

  return { data, loading, error };
}
