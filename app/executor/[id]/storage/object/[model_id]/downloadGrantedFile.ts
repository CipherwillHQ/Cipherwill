// Downloads executor-granted objects through the existing web-side access checks.
// Owns key retrieval and local decryption before the native or browser export.
// Does not send capsule or session keys to native code.
import toast from "react-hot-toast";
import { fetchEncryptedFile } from "@/common/data/fetchEncryptedFile";
import { saveDecryptedFile } from "@/common/data/saveDecryptedFile";
import type { GrantedFileDownloadArgs } from "@/types/interfaces";
import GET_KEY_BY_REF_ID from "@/graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import GET_GRANTED_METAMODEL from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODEL";
import GET_BENEFICIARY_ENCRYPTION_KEY from "@/graphql/ops/app/executor/access/queries/GET_BENEFICIARY_ENCRYPTION_KEY";
import get_pod_decryption_key from "@/common/executor/data/get_pod_decryption_key";
import type {
  GetKeyByRefIdQuery,
  GetKeyByRefIdVariables,
  GetBeneficiaryEncryptionKeyQuery,
  GetBeneficiaryEncryptionKeyVariables,
  GetGrantedMetamodelQuery,
  GetGrantedMetamodelVariables,
} from "@/types/interfaces/metamodel";
import GET_GRANTED_STORAGE_OBJECT_DOWNLOAD_URL from "@/graphql/ops/app/executor/access/queries/GET_GRANTED_STORAGE_OBJECT_DOWNLOAD_URL";

export default async function downloadGrantedFile({client, session, id, access_id}: GrantedFileDownloadArgs) {
  // download decryption key
  const encryption_key = await client.query<
    GetKeyByRefIdQuery,
    GetKeyByRefIdVariables
  >({
    query: GET_KEY_BY_REF_ID,
    fetchPolicy: "network-only",
    variables: session
      ? {
          ref_id: id,
          publicKey: session.publicKey,
        }
      : {
          ref_id: id,
          publicKey: "null",
        },
  });

  // get time capsule private key to decrypt data
  const { data: beneficairy_encryption_key } = await client.query<
    GetBeneficiaryEncryptionKeyQuery,
    GetBeneficiaryEncryptionKeyVariables
  >({
    query: GET_BENEFICIARY_ENCRYPTION_KEY,
    variables: {
      access_id,
    },
  });

  if (!beneficairy_encryption_key?.getBeneficiaryEncryptionKey) {
    toast.error("You do not have access key to decrypt this data");
    return;
  }

  if (!encryption_key.data?.getKeyByRefId?.key) {
    toast.error("Unable to retrieve encryption key");
    return;
  }

  const pod_decryption_key = await get_pod_decryption_key({
    encrypted_key: encryption_key.data.getKeyByRefId.key,
    time_capsule_private_key:
      beneficairy_encryption_key.getBeneficiaryEncryptionKey,
    current_session_private_key: session ? session.privateKey : null,
  });

  if (!pod_decryption_key || pod_decryption_key.length < 16) {
    toast.error("Invalid encryption key");
    return;
  }

  const metamodel_response = await client.query<
    GetGrantedMetamodelQuery,
    GetGrantedMetamodelVariables
  >({
    query: GET_GRANTED_METAMODEL,
    fetchPolicy: "network-only",
    variables: {
      access_id: access_id,
      model_id: id,
    },
  });

  if (!metamodel_response.data?.getGrantedMetamodel) {
    toast.error("Unable to retrieve metamodel data");
    return;
  }

  const metamodel = metamodel_response.data.getGrantedMetamodel;
  const parsed_metadata = JSON.parse(metamodel.metadata);
  if (!parsed_metadata || parsed_metadata.title === undefined) {
    toast.error("No title found");
    return;
  }

  // start encrypted object download
  // let pod;
  // try {
  //   pod = await client.query({
  //     query: GET_POD,
  //     fetchPolicy: "network-only",
  //     variables: {
  //       ref_id: id,
  //     },
  //   });
  // } catch (error) {
  //   toast.error("Error while downloading data");
  //   logger.error("Error while downloading data", error);
  //   return;
  // }

  const download = await client.query({query: GET_GRANTED_STORAGE_OBJECT_DOWNLOAD_URL, fetchPolicy: "network-only", variables: {access_id, ref_id: id}});
  const pod_data = await fetchEncryptedFile((download.data as any).getGrantedStorageObjectDownloadUrl);
  return saveDecryptedFile(pod_data, pod_decryption_key, {title: parsed_metadata.title, type: parsed_metadata.type});
}
