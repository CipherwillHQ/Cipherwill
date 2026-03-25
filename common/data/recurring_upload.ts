import { ApolloClient } from "@apollo/client";
import logger from "../debug/logger";
import UPDATE_KEY from "../../graphql/ops/app/key/Mutations/UPDATE_KEY";
import { Key } from "./types";

export default async function recurring_upload({
  client,
  key_cluster,
  operation_id_prefix,
}: {
  client: ApolloClient;
  key_cluster: Key[];
  operation_id_prefix?: string;
}) {
  logger.info(`Starting recurring upload of ${key_cluster.length} items`);
  const MAX_SIZE = 500000; // 500 kb per request payload
  let size = 0;
  let current_stack: Key[] = [];
  let chunkIndex = 0;
  const fallbackPrefix = `key-upload-${Date.now()}-${Math.floor(
    Math.random() * 1000000
  )}`;
  const prefix = operation_id_prefix || fallbackPrefix;
  for await (const item of key_cluster) {
    size += item.key.length;
    current_stack.push(item);
    if (size >= MAX_SIZE || current_stack.length >= 100) {
      logger.info(
        `Step data upload ${size / 1024} kB and ${current_stack.length} items`
      );
      const operation_id = `${prefix}:chunk:${chunkIndex}`;
      await client.mutate({
        mutation: UPDATE_KEY,
        variables: {
          items: current_stack,
          operation_id,
        },
      });
      chunkIndex++;
      size = 0;
      current_stack = [];
    }
  }

  if (current_stack.length > 0) {
    logger.info(
      `Step data upload ${size / 1024} kB and ${current_stack.length} items`
    );
    const operation_id = `${prefix}:chunk:${chunkIndex}`;
    await client.mutate({
      mutation: UPDATE_KEY,
      variables: {
        items: current_stack,
        operation_id,
      },
    });
  }
}
