import { ApolloClient } from "@apollo/client";
import logger from "../debug/logger";
import UPDATE_KEY from "../../graphql/ops/app/key/Mutations/UPDATE_KEY";
import { Key } from "./types";

export default async function recurring_upload({
  client,
  key_cluster,
}: {
  client: ApolloClient<any>;
  key_cluster: Key[];
}) {
  logger.info(`Starting recurring upload of ${key_cluster.length} items`);
  const MAX_SIZE = 500000; // 500 kb per request payload
  let size = 0;
  let current_stack: Key[] = [];
  for await (const item of key_cluster) {
    size += item.key.length;
    current_stack.push(item);
    if (size >= MAX_SIZE || current_stack.length >= 100) {
      logger.info(
        `Step data upload ${size / 1024} kB and ${current_stack.length} items`
      );
      await client.mutate({
        mutation: UPDATE_KEY,
        variables: {
          items: current_stack,
        },
      });
      size = 0;
      current_stack = [];
    }
  }

  if (current_stack.length > 0) {
    logger.info(
      `Step data upload ${size / 1024} kB and ${current_stack.length} items`
    );
    await client.mutate({
      mutation: UPDATE_KEY,
      variables: {
        items: current_stack,
      },
    });
  }
}
