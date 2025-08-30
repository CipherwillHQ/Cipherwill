import { ApolloClient } from "@apollo/client";
import logger from "../../common/debug/logger";
import GET_KEY_ITEMS_BY_PUBLIC_KEY from "../../graphql/ops/app/key/Queries/GET_KEY_ITEMS_BY_PUBLIC_KEY";

export default async function getAllKeys({
  client,
  maxPublicKey,
}: {
  client: ApolloClient;
  maxPublicKey: string;
}) {
  let data:any[] = [];
  let cursor = undefined;
  let has_more = true;
  while (has_more) {
    logger.info(
      `Downloading for cursor:${cursor} and has_more:${has_more} and publicKey:${maxPublicKey}`
    );

    // download all from max one
    const res: any = await client.query({
      query: GET_KEY_ITEMS_BY_PUBLIC_KEY,
      fetchPolicy: "network-only",
      variables: cursor
        ? {
            publicKey: maxPublicKey,
            cursor,
          }
        : {
            publicKey: maxPublicKey,
          },
    });

    has_more = res.data.getKeyItemsByPublicKey.has_more;
    cursor =
      res.data.getKeyItemsByPublicKey.items.length > 0
        ? res.data.getKeyItemsByPublicKey.items[
            res.data.getKeyItemsByPublicKey.items.length - 1
          ].id
        : undefined;
    logger.info("Downloaded items", res.data.getKeyItemsByPublicKey.items);
    for await (const item of res.data.getKeyItemsByPublicKey.items) {
      data.push(item);
    }
  }
  return data;
}
