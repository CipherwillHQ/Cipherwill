"use client";
import { useApolloClient } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "../SessionContext";
import GET_POD from "@/graphql/ops/app/pod/queries/GET_POD";
import toast from "react-hot-toast";
import GET_KEY_BY_REF_ID from "@/graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import decrypt from "@/crypto/e0/decrypt";
import logger from "@/common/debug/logger";
import CryptoJS from "crypto-js";
import { POD_TYPE } from "@/types/POD";
import parseToLatestDataModel from "./parseToLatestDataModel";
import upload_pod_data from "@/common/data/upload_pod_data";

export function usePod<POD_DATA_TYPE>(
  config: {
    TYPE: POD_TYPE;
    VERSION: string;
    REF_ID: string;
    DATA_SAMPLE: POD_DATA_TYPE;
  },
  options?: {
    onComplete?: (data: null | POD_DATA_TYPE) => void;
    lazy?: boolean;
  }
) {
  const defaultOptions = {
    onComplete: (data) => {},
    lazy: false,
  };
  const { onComplete, lazy } = {
    ...defaultOptions,
    ...options,
  };
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
      pod = await client.query({
        query: GET_POD,
        fetchPolicy: "network-only",
        variables: {
          ref_id: config.REF_ID,
        },
      });
    } catch (error) {
      if (
        error &&
        error.graphQLErrors &&
        error.graphQLErrors[0] &&
        error.graphQLErrors[0].extensions.code === "POD_NOT_FOUND"
      ) {
        setData(null);
        onComplete(null);
        setLoading(false);
        return null;
      } else {
        setError(error.message || "Something went wrong");
        throw error;
      }
    }
    if (!pod || !pod.data || !pod.data.getPod || !pod.data.getPod.content) {
      setData(null);
      onComplete(null);
      setLoading(false);
      return null;
    }
    const content = pod.data.getPod.content;

    const encryption_key = await client.query({
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

    if (
      encryption_key.data &&
      encryption_key.data.getKeyByRefId &&
      encryption_key.data.getKeyByRefId.key
    ) {
      if (encryption_key.data.getKeyByRefId.key.startsWith("{")) {
        const parsedData = JSON.parse(encryption_key.data.getKeyByRefId.key);
        if (parsedData.type === "E0") {
          key = await decrypt(
            session.privateKey,
            Buffer.from(parsedData.ciphertext, "base64"),
            Buffer.from(parsedData.ephemPublicKey, "base64"),
            Buffer.from(parsedData.iv, "base64"),
            Buffer.from(parsedData.mac, "base64")
          );
        }
      } else {
        key = encryption_key.data.getKeyByRefId.key;
      }
    } else {
      setData(null);
      onComplete(null);
      setError(`You don't have access to this note`);

      setLoading(false);
      return null;
    }
    let json_string;
    try {
      json_string = CryptoJS.AES.decrypt(content, key).toString(
        CryptoJS.enc.Utf8
      );
    } catch (error) {
      toast.error("Error while decrypting data");
      logger.error("Error while decrypting data", error);
    }
    if (!json_string) {
      setData(null);
      onComplete(null);
      setLoading(false);
      return null;
    }

    let final_content: {
      type: string;
      version: string;
      data: any;
    } = {
      type: config.TYPE,
      version: config.VERSION,
      data: {},
    };

    if (json_string.startsWith("{")) {
      const parsed_pod_data = JSON.parse(json_string);

      final_content.type = parsed_pod_data?.type || config.TYPE;
      final_content.version = parsed_pod_data?.version || "0.0.1";
      if (parsed_pod_data?.data) {
        // perfrom historical version conversion to current version
        final_content.data = parseToLatestDataModel({
          type: parsed_pod_data?.type || config.TYPE,
          data_version: parsed_pod_data?.version || "0.0.1",
          expected_version: config.VERSION,
          data: parsed_pod_data.data,
        });
      } else {
        final_content.data = {};
      }
    } else {
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

  async function updatePod(upated_data: POD_DATA_TYPE) {
    // strip out all fields that are not in the type
    let final_data = {};
    for await (const key of Object.keys(config.DATA_SAMPLE)) {
      if (upated_data[key]) {
        final_data[key] = upated_data[key];
      }
    }
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
