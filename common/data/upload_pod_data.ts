import { ApolloClient } from "@apollo/client";
import recurring_upload from "./recurring_upload";
import { DataItem, EncryptionKeys, Key } from "./types";
import generate_encryption_keys from "./generate_encryption_keys";
import generate_keys_for_beneficiaries from "./generate_keys_for_beneficiaries";
import generate_keys_for_own_factors from "./generate_keys_for_own_factors";
import encrypt_and_upload_pod from "./encrypt_and_upload_pod";
import logger from "../debug/logger";

export default async function upload_pod_data({
  data_items,
  client,
}: {
  data_items: DataItem[];
  client: ApolloClient<any>;
}) {
  logger.info(`Uploading ${data_items.length} data items`);
  // generate random key for each data item
  let encryption_keys: EncryptionKeys = await generate_encryption_keys({
    data_items,
  });

  // encrypt each data item with generated random key and upload pod
  await encrypt_and_upload_pod({ encryption_keys, data_items, client });

  // create empty key cluster
  let key_cluster: Key[] = [];

  // create keys for own factors
  await generate_keys_for_own_factors({ key_cluster, encryption_keys, client });

  // TODO: add support for shared access factors

  // create keys for beneficiaries
  await generate_keys_for_beneficiaries({ key_cluster, encryption_keys, client });

  // upload cluster keys
  await recurring_upload({ client, key_cluster });
}
