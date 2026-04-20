import { ApolloClient } from "@apollo/client";
import { DataItem, EncryptionKeys, Key } from "./types";
import generate_encryption_keys from "./generate_encryption_keys";
import generate_keys_for_beneficiaries from "./generate_keys_for_beneficiaries";
import generate_keys_for_own_factors from "./generate_keys_for_own_factors";
import encrypt_and_upload_pod, {
  PodUploadCommitPayload,
} from "./encrypt_and_upload_pod";
import logger from "../debug/logger";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import COMMIT_POD_AND_KEYS from "@/graphql/ops/app/pod/mutations/COMMIT_POD_AND_KEYS";
import { GetMetamodelQuery, GetMetamodelVariables } from "@/types";

export default async function upload_pod_data({
  data_items,
  client,
  metamodel_id,
}: {
  data_items: DataItem[];
  client: ApolloClient;
  metamodel_id: string;
}) {
  logger.info(`Uploading ${data_items.length} data items`);
  // generate random key for each data item
  let encryption_keys: EncryptionKeys = await generate_encryption_keys({
    data_items,
  });

  // encrypt each data item and perform the upload phase
  const uploaded_pods: PodUploadCommitPayload[] = await encrypt_and_upload_pod({
    encryption_keys,
    data_items,
    client,
  });

  // create empty key cluster
  let key_cluster: Key[] = [];

  // create keys for own factors
  await generate_keys_for_own_factors({ key_cluster, encryption_keys, client });

  // TODO: add support for shared access factors

  // get ignored beneficiaries from metamoodel query
  // do not need to do network_only as it is unlikely to change here
  // becuase if beneficiaries are changed, it updates the local metamodel state as well
  const metamodel = await client.query<
    GetMetamodelQuery,
    GetMetamodelVariables
  >({
    query: GET_METAMODEL,
    variables: {
      id: metamodel_id,
    },
  });
  if (!metamodel || !metamodel.data) {
    throw new Error("Metamodel not found");
  }
  const ignored_beneficiaries: string[] =
    metamodel.data.getMetamodel.ignored_beneficiaries || [];

  // create keys for beneficiaries
  await generate_keys_for_beneficiaries({
    key_cluster,
    encryption_keys,
    client,
    ignored_beneficiaries,
  });

  const keys_by_ref = new Map<string, Key[]>();
  for await (const key_item of key_cluster) {
    const existing_items = keys_by_ref.get(key_item.ref_id) || [];
    existing_items.push(key_item);
    keys_by_ref.set(key_item.ref_id, existing_items);
  }

  // atomically commit pod metadata + keys per ref_id
  for await (const uploaded_pod of uploaded_pods) {
    const keys_for_ref = keys_by_ref.get(uploaded_pod.ref_id) || [];
    if (keys_for_ref.length === 0) {
      throw new Error(`No keys generated for ref_id ${uploaded_pod.ref_id}`);
    }
    if (uploaded_pod.mode === "STORAGE" && !uploaded_pod.upload_id) {
      throw new Error(`No upload_id found for storage ref_id ${uploaded_pod.ref_id}`);
    }

    const commit_res = await client.mutate({
      mutation: COMMIT_POD_AND_KEYS,
      variables: {
        upload_id:
          uploaded_pod.mode === "STORAGE" ? uploaded_pod.upload_id : null,
        ref_id: uploaded_pod.ref_id,
        data_model_version: uploaded_pod.data_model_version,
        mode: uploaded_pod.mode,
        encrypted_text:
          uploaded_pod.mode === "TEXT" ? uploaded_pod.encrypted_text : null,
        items: keys_for_ref,
      },
    });

    if (!(commit_res.data as any)?.commitPodAndKeys) {
      logger.error(`Failed to commit pod and keys for ${uploaded_pod.ref_id}`);
      throw new Error("Failed to commit pod and keys");
    }
  }
}
