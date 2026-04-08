"use client";
import { useApolloClient } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const {
    TYPE: type,
    VERSION: version,
    REF_ID: refId,
    DATA_SAMPLE: dataSample,
  } = config;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<null | POD_DATA_TYPE>(null);

  const [isUpdating, setIsUpdating] = useState(false);

  const client = useApolloClient();
  const { session } = useSession();
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const pod = await client.query<GetPodQuery, GetPodVariables>({
        query: GET_POD,
        fetchPolicy: "network-only",
        variables: {
          ref_id: refId,
        },
      });

      const content = getPodContent(pod);
      if (!content) {
        setData(null);
        onCompleteRef.current(null);
        return null;
      }

      const encryptionKey = await client.query<
        GetKeyByRefIdQuery,
        GetKeyByRefIdVariables
      >({
        query: GET_KEY_BY_REF_ID,
        fetchPolicy: "network-only",
        variables: session
          ? {
              ref_id: refId,
              publicKey: session.publicKey,
            }
          : {
              ref_id: refId,
              publicKey: "null",
            },
      });

      const encryptedKey = encryptionKey.data?.getKeyByRefId?.key;
      if (!encryptedKey) {
        setData(null);
        onCompleteRef.current(null);
        setError(`You don't have access to this note`);
        return null;
      }

      if (!session && encryptedKey.startsWith("{")) {
        setData(null);
        onCompleteRef.current(null);
        setError("Session is required to decrypt this pod");
        return null;
      }

      const key = await resolveDecryptionKey(encryptedKey, session);
      const jsonString = decryptPodJson(content, key);

      if (!jsonString) {
        setData(null);
        onCompleteRef.current(null);
        return null;
      }

      const finalContent = parsePodJsonToModel(jsonString, {
        TYPE: type,
        VERSION: version,
        REF_ID: refId,
        DATA_SAMPLE: dataSample,
      });

      if (!finalContent) {
        logger.error("Decrypted data is not a valid json string");
        setData(null);
        onCompleteRef.current(null);
        return null;
      }

      if (finalContent.type === type) {
        setData(finalContent.data);
        onCompleteRef.current(finalContent.data);
        return finalContent.data;
      }

      logger.error("Parsed pod data is not of the correct type");
      setData(null);
      onCompleteRef.current(null);
      return null;
    } catch (error) {
      if (isPodNotFoundError(error)) {
        setData(null);
        onCompleteRef.current(null);
        return null;
      }

      const message =
        error instanceof Error ? error.message : "Something went wrong";
      setError(message);
      logger.error("Failed to load pod", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [client, refId, session, type, version, dataSample]);

  useEffect(() => {
    if (!lazy) {
      void loadData();
    }
  }, [lazy, loadData]);

  async function updatePod(
    updatedData: POD_DATA_TYPE,
    {
      metamodel_id,
    }: {
      metamodel_id: string;
    },
  ) {
    // strip out all fields that are not in the type
    const finalData = pickAllowedPodData(updatedData, dataSample);
    // json validate final_data
    // TODO: add json validation

    const finalPods = [
      {
        ref_id: refId,
        data_model_version: version,
        publicKey: session ? session.publicKey : undefined,
        data: JSON.stringify({
          type,
          version,
          data: finalData,
        }),
      },
    ];
    setIsUpdating(true);
    try {
      if (Object.keys(finalData).length > 0) {
        await upload_pod_data({
          data_items: finalPods,
          client,
          metamodel_id,
        });
      }
    } finally {
      setIsUpdating(false);
    }
  }

  return {
    data,
    loading,
    error,
    is_updating: isUpdating,
    updatePod,
    loadPod: loadData,
  };
}
