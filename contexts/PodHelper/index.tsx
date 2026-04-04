"use client";
import { useApolloClient } from "@apollo/client/react";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "../SessionContext";
import GET_POD from "@/graphql/ops/app/pod/queries/GET_POD";
import GET_KEY_BY_REF_ID from "@/graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import logger from "@/common/debug/logger";
import upload_pod_data from "@/common/data/upload_pod_data";
import {
  GetKeyByRefIdQuery,
  GetKeyByRefIdVariables,
  GetPodQuery,
  GetPodVariables,
} from "@/types/interfaces/metamodel";
import { getPodHookOptions } from "./defaults";
import {
  decryptPodJson,
  getPodContent,
  isPodNotFoundError,
  parsePodJsonToModel,
  pickAllowedPodData,
  resolveDecryptionKey,
} from "./helpers";
import { PodHookConfig, PodHookOptions } from "./types";

export function usePod<POD_DATA_TYPE>(
  config: PodHookConfig<POD_DATA_TYPE>,
  options?: PodHookOptions<POD_DATA_TYPE>,
) {
  const { onComplete, lazy } = getPodHookOptions(options);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<null | POD_DATA_TYPE>(null);

  const [is_updating, setIsUpdating] = useState(false);

  const client = useApolloClient();
  const { session } = useSession();

  const load_data = useCallback(async () => {
    setLoading(true);
    let pod;
    try {
      pod = await client.query<GetPodQuery, GetPodVariables>({
        query: GET_POD,
        fetchPolicy: "network-only",
        variables: {
          ref_id: config.REF_ID,
        },
      });
    } catch (error) {
      if (isPodNotFoundError(error)) {
        setData(null);
        onComplete(null);
        setLoading(false);
        return null;
      } else {
        setError(error.message || "Something went wrong");
        throw error;
      }
    }
    const content = getPodContent(pod);
    if (!content) {
      setData(null);
      onComplete(null);
      setLoading(false);
      return null;
    }

    const encryption_key = await client.query<
      GetKeyByRefIdQuery,
      GetKeyByRefIdVariables
    >({
      query: GET_KEY_BY_REF_ID,
      fetchPolicy: "network-only",
      variables: session
        ? {
            ref_id: config.REF_ID,
            publicKey: session.publicKey,
          }
        : {
            ref_id: config.REF_ID,
            publicKey: "null",
          },
    });
    
    let key = "";
    const encryptedKey = encryption_key.data?.getKeyByRefId?.key;

    if (encryptedKey) {
      key = await resolveDecryptionKey(encryptedKey, session);
    } else {
      setData(null);
      onComplete(null);
      setError(`You don't have access to this note`);

      setLoading(false);
      return null;
    }
    const json_string = decryptPodJson(content, key);
    if (!json_string) {
      setData(null);
      onComplete(null);
      setLoading(false);
      return null;
    }

    const final_content = parsePodJsonToModel(json_string, config);
    if (!final_content) {
      // decrypted data is not a valid json string
      // reset the pod data
      logger.error("Decrypted data is not a valid json string");
      setData(null);
      onComplete(null);
      setLoading(false);
      return null;
    }

    if (final_content.type === config.TYPE) {
      setData(final_content.data);
      onComplete(final_content.data);
      setLoading(false);
      return final_content.data;
    } else {
      // parsed data is not of the correct type
      // reset the pod data
      logger.error("Parsed pod data is not of the correct type");
      setData(null);
      onComplete(null);
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!lazy) load_data();
  }, []);

  async function updatePod(
    upated_data: POD_DATA_TYPE,
    {
      metamodel_id,
    }: {
      metamodel_id: string;
    },
  ) {
    // strip out all fields that are not in the type
    const final_data = pickAllowedPodData(upated_data, config.DATA_SAMPLE);
    // json validate final_data
    // TODO: add json validation

    const final_pods = [
      {
        ref_id: config.REF_ID,
        data_model_version: config.VERSION,
        publicKey: session ? session.publicKey : undefined,
        data: JSON.stringify({
          type: config.TYPE,
          version: config.VERSION,
          data: final_data,
        }),
      },
    ];
    setIsUpdating(true);
    if (Object.keys(final_data).length > 0) {
      await upload_pod_data({
        data_items: final_pods,
        client,
        metamodel_id,
      });
    }
    setIsUpdating(false);
  }

  return {
    data,
    loading,
    error,
    is_updating,
    updatePod,
    loadPod: () => {
      return load_data();
    },
  };
}
