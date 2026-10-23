// Uploads encrypted pods and stages keys for owners and allowed beneficiaries.
// Owns upload orchestration and awaits the shared key commit loop.
// Does not determine restore eligibility or parse backup archives.

import { ApolloClient } from "@apollo/client";
import { DataItem, EncryptionKeys, Key } from "./types";
import generate_encryption_keys from "./generate_encryption_keys";
import generate_keys_for_beneficiaries from "./generate_keys_for_beneficiaries";
import generate_keys_for_own_factors from "./generate_keys_for_own_factors";
import encrypt_and_upload_pod from "./encrypt_and_upload_pod";
import logger from "../debug/logger";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import UPLOAD_SESSION_KEYS from "@/graphql/ops/app/pod/mutations/UPLOAD_SESSION_KEYS";
import { commitSessionUntilCompleted } from "./commit_upload_session";
import { GetMetamodelQuery, GetMetamodelVariables } from "@/types";

const MAX_KEYS_PER_REQUEST = 1000;
const MAX_KEY_PAYLOAD_SIZE = 500000; // 500kb per request payload

function split_keys_for_upload(keys: Key[]): Key[][] {
  const chunks: Key[][] = [];
  let current_chunk: Key[] = [];
  let current_size = 0;

  for (const key of keys) {
    const key_size = key.key.length;
    const exceeds_size =
      current_chunk.length > 0 && current_size + key_size > MAX_KEY_PAYLOAD_SIZE;
    const exceeds_count = current_chunk.length >= MAX_KEYS_PER_REQUEST;

    if (exceeds_size || exceeds_count) {
      chunks.push(current_chunk);
      current_chunk = [];
      current_size = 0;
    }

    current_chunk.push(key);
    current_size += key_size;
  }

  if (current_chunk.length > 0) {
    chunks.push(current_chunk);
  }

  return chunks;
}

async function upload_session_keys({
  client,
  session_id,
  keys,
  signal,
}: {
  client: ApolloClient;
  session_id: string;
  keys: Key[];
  signal?: AbortSignal;
}) {
  if (keys.length === 0) {
    throw new Error(`No keys generated for upload session ${session_id}`);
  }

  const chunks = split_keys_for_upload(keys);
  logger.info(
    `Uploading ${keys.length} keys in ${chunks.length} chunks for session ${session_id}`
  );

  for await (const chunk of chunks) {
    signal?.throwIfAborted();
    const res = await client.mutate({
      mutation: UPLOAD_SESSION_KEYS,
      variables: {
        session_id,
        keys: chunk,
      },
    });
    if (!(res.data as any)?.uploadSessionKeys?.id) {
      throw new Error(`Failed to stage keys for session ${session_id}`);
    }
  }
}

export default async function upload_pod_data({
  data_items,
  client,
  metamodel_id,
  require_missing_pod = false,
  signal,
}: {
  data_items: DataItem[];
  client: ApolloClient;
  metamodel_id: string;
  require_missing_pod?: boolean;
  signal?: AbortSignal;
}) {
  signal?.throwIfAborted();
  logger.info(`Uploading ${data_items.length} data items`);
  // generate random key for each data item
  let encryption_keys: EncryptionKeys = await generate_encryption_keys({
    data_items,
  });

  signal?.throwIfAborted();
  const upload_sessions = await encrypt_and_upload_pod({
    encryption_keys,
    data_items,
    client,
    require_missing_pod,
    signal,
  });

  signal?.throwIfAborted();
  // create empty key cluster
  let key_cluster: Key[] = [];

  // create keys for own factors
  await generate_keys_for_own_factors({ key_cluster, encryption_keys, client, signal });

  signal?.throwIfAborted();
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
  signal?.throwIfAborted();
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
    signal,
  });

  signal?.throwIfAborted();
  const keys_by_ref_id = new Map<string, Key[]>();
  for (const key_item of key_cluster) {
    const keys_for_ref = keys_by_ref_id.get(key_item.ref_id) || [];
    keys_for_ref.push(key_item);
    keys_by_ref_id.set(key_item.ref_id, keys_for_ref);
  }

  for await (const session of upload_sessions) {
    signal?.throwIfAborted();
    const keys_for_session = keys_by_ref_id.get(session.ref_id) || [];
    await upload_session_keys({
      client,
      session_id: session.session_id,
      keys: keys_for_session,
      signal,
    });
    await commitSessionUntilCompleted({
      client,
      session_id: session.session_id,
      signal,
    });
  }
}
