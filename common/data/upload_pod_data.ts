import { ApolloClient } from "@apollo/client";
import { DataItem, EncryptionKeys, Key } from "./types";
import generate_encryption_keys from "./generate_encryption_keys";
import generate_keys_for_beneficiaries from "./generate_keys_for_beneficiaries";
import generate_keys_for_own_factors from "./generate_keys_for_own_factors";
import { create_encrypted_file } from "./encrypt_and_upload_pod";
import logger from "../debug/logger";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import { GetMetamodelQuery, GetMetamodelVariables } from "@/types";
import UPSERT_POD_WITH_KEYS from "@/graphql/ops/app/pod/mutations/UPSERT_POD_WITH_KEYS";

function get_operation_id(ref_id: string): string {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `${ref_id}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

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

  for await (const item of data_items) {
    const encrypted_file = await create_encrypted_file({
      encryption_keys,
      item,
    });
    if (!encrypted_file) {
      throw new Error(`Failed to encrypt data for ${item.ref_id}`);
    }

    const keys_for_ref = key_cluster.filter((key_item) => {
      return key_item.ref_id === item.ref_id;
    });
    if (keys_for_ref.length === 0) {
      throw new Error(`No keys generated for ${item.ref_id}`);
    }

    const operation_id = get_operation_id(item.ref_id);
    logger.info(`Atomic pod+key upload started`, {
      ref_id: item.ref_id,
      operation_id,
      key_count: keys_for_ref.length,
    });

    await client.mutate({
      mutation: UPSERT_POD_WITH_KEYS,
      variables: {
        data_model_version: item.data_model_version,
        ref_id: item.ref_id,
        file: encrypted_file,
        key_cluster: keys_for_ref,
        operation_id,
      },
      context: {
        headers: {
          "apollo-require-preflight": true,
        },
      },
    });

    logger.info(`Atomic pod+key upload completed`, {
      ref_id: item.ref_id,
      operation_id,
    });
  }
}
