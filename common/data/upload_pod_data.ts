import { ApolloClient } from "@apollo/client";
import recurring_upload from "./recurring_upload";
import { DataItem, Key } from "./types";
import generate_encryption_key from "./generate_encryption_keys";
import generate_keys_for_beneficiaries from "./generate_keys_for_beneficiaries";
import generate_keys_for_own_factors from "./generate_keys_for_own_factors";
import encrypt_and_upload_pod from "./encrypt_and_upload_pod";
import logger from "../debug/logger";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import { GetMetamodelQuery, GetMetamodelVariables } from "@/types";

export default async function upload_pod_data({
  data_item,
  client,
  metamodel_id,
}: {
  data_item: DataItem;
  client: ApolloClient;
  metamodel_id: string;
}) {
  logger.info("Uploading 1 data item");
  // generate random key for this data item
  const encryption_key = await generate_encryption_key({
    data_item,
  });

  // encrypt and upload pod
  await encrypt_and_upload_pod({
    encryption_key,
    data_item,
    client,
  });

  // create empty key cluster
  let key_cluster: Key[] = [];

  // create keys for own factors
  await generate_keys_for_own_factors({
    key_cluster,
    encryption_key,
    client,
  });

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
    encryption_key,
    client,
    ignored_beneficiaries,
  });

  // upload cluster keys
  await recurring_upload({ client, key_cluster });
}
