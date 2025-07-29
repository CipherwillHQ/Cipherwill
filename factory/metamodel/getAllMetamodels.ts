import { ApolloClient } from "@apollo/client";
import logger from "../../common/debug/logger";
import GET_METAMODELS from "../../graphql/ops/app/metamodel/queries/GET_METAMODELS";

export default async function getAllMetamodels({
  client,
  type,
}: {
  client: ApolloClient<any>;
  type?: string;
}) {
  let metamodels:any[] = [];
  let cursor = undefined;
  let has_more = true;
  while (has_more) {
    logger.info(
      `Downloading ${
        type || "All"
      } Metamodels for cursor:${cursor} and has_more:${has_more}`
    );

    // download all from max one
    const res: any = await client.query({
      query: GET_METAMODELS,
      fetchPolicy: "network-only",
      variables: cursor
        ? {
            cursor,
            type,
          }
        : {
            type,
          },
    });

    has_more = res.data.getMetamodels.has_more;
    cursor =
      res.data.getMetamodels.models[res.data.getMetamodels.models.length - 1]
        .id;
    logger.info("Downloaded metamodels", res.data.getMetamodels.models);
    for await (const item of res.data.getMetamodels.models) {
      metamodels.push(item);
    }
  }
  return metamodels;
}
