import { ApolloClient } from "@apollo/client";
import GET_MY_KEY_COUNT from "../../graphql/ops/app/key/Queries/GET_MY_KEY_COUNT";

declare type CountResult = {
  count: number;
  publicKey: string[];
};

export default async function getMyKeyCount(
  client: ApolloClient<any>
): Promise<CountResult> {
  const { data } = await client.query({
    fetchPolicy: "network-only",
    query: GET_MY_KEY_COUNT,
  });
  let maxKeyCount = 0;
  let maxPublicKeys: string[] = ["null"];
  if (data === null || data.getMyKeyCount === undefined) {
    return {
      count: maxKeyCount,
      publicKey: maxPublicKeys,
    };
  }
  for await (const factor of data.getMyKeyCount) {
    if (factor.count > maxKeyCount) {
      maxKeyCount = factor.count;
    }
  }
  for await (const factor of data.getMyKeyCount) {
    if (
      factor.count === maxKeyCount &&
      maxPublicKeys.indexOf(factor.publicKey) === -1
    ) {
      maxPublicKeys.push(factor.publicKey);
    }
  }
  return {
    count: maxKeyCount,
    publicKey: maxPublicKeys,
  };
}
