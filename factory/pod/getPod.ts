import { ApolloClient } from "@apollo/client";
import GET_POD from "../../graphql/ops/app/pod/queries/GET_POD";

export default async function getPod(
  ref_id: string,
  client: ApolloClient<any>
) {
  try {
    const pod = await client.query({
      query: GET_POD,
      fetchPolicy: "network-only",
      variables: {
        ref_id,
      },
    });
    if (pod && pod.data && pod.data.getPod && pod.data.getPod.content) {
      return pod.data.getPod.content;
    } else {
      pod.data.getPod.content;
    }
  } catch (error) {
    if (error.graphQLErrors[0].extensions.code === "POD_NOT_FOUND") {
      return null;
    } else {
      throw error;
    }
  }
}
