import { ApolloClient } from "@apollo/client";
import GET_ALL_KEY_COUNT from "../../graphql/ops/app/key/Queries/GET_ALL_KEY_COUNT";

declare type CountResult = {
  count: number;
  publicKey: string[];
};

export default async function getMaxKeyCount(
  client: ApolloClient<any>
): Promise<CountResult> {
  const { data } = await client.query({
    fetchPolicy: "network-only",
    query: GET_ALL_KEY_COUNT,
  });
  let maxKeyCount = 0;
  let maxPublicKeys: string[] = ["null"];
  if (data === null || data.getAllKeyCount === undefined) {
    return {
      count: maxKeyCount,
      publicKey: maxPublicKeys,
    };
  }
  for await (const factor of data.getAllKeyCount) {
    if (factor.count > maxKeyCount) {
      maxKeyCount = factor.count;
    }
  }
  for await (const factor of data.getAllKeyCount) {
    if (factor.count === maxKeyCount) {
      maxPublicKeys.push(factor.publicKey);
    }
  }
  return {
    count: maxKeyCount,
    publicKey: maxPublicKeys,
  };
}
