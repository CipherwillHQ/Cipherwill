import toast from "react-hot-toast";
import perform_migrate_out from "./perform_migrate_out";
import { ApolloClient } from "@apollo/client";
import DELETE_FACTOR from "../../graphql/ops/auth/mutations/DELETE_FACTOR";
import DELETE_KEY_BY_PUBLIC_KEY from "../../graphql/ops/app/key/Mutations/DELETE_KEY_BY_PUBLIC_KEY";
import GET_ALL_KEY_COUNT from "@/graphql/ops/app/key/Queries/GET_ALL_KEY_COUNT";
import { GetAllKeyCountQuery } from "@/types/interfaces/metamodel";

export default async function remove_factor(
  client: ApolloClient,
  session_publicKey: string,
  session_privateKey: string,
  factor_id: string,
  factor_publicKey: string,
) {
  // if user has another factor with same or multiple data points then this is optional factor can be deleted without migrate out

  // get all key count
  const { data } = await client.query<GetAllKeyCountQuery>({
    query: GET_ALL_KEY_COUNT,
    fetchPolicy: "network-only",
  });

  const allKeyCounts = data?.getAllKeyCount ?? [];

  // user will always have key count record 
  // but adding this check to be safe and hard fail
  if (allKeyCounts.length === 0) {
    toast.error("Unable to load key counts");
    return;
  }

  let max_count = 0;
  let this_key_count = 0;
  let max_publicKey: string | null = null;

  for (const item of allKeyCounts) {
    const count = Number(item?.count ?? 0);
    const publicKey = item?.publicKey ?? "";

    if (publicKey !== factor_publicKey && count >= max_count) {
      max_count = count;
      max_publicKey = publicKey;
    }
    if (publicKey === factor_publicKey) {
      this_key_count = count;
    }
  }

  const is_optional_factor =
    max_publicKey !== null && // has another factor public key
    max_count >= this_key_count && // has same or more data points than this factor
    max_publicKey !== factor_publicKey; // the other factor public key is not this factor public key

  if (is_optional_factor) {
    // optional factor can be removed without migrate out
  } else {
    // single factor with data points, need to migrate out before delete
    if (session_publicKey === factor_publicKey) {
      await perform_migrate_out(client, factor_publicKey, session_privateKey);
    } else {
      toast.error("You need to login with the factor you want to remove");
      return;
    }
  }

  // delete by public key
  await client.mutate({
    mutation: DELETE_KEY_BY_PUBLIC_KEY,
    variables: {
      publicKey: factor_publicKey,
    },
  });
  toast.success(`Delete all data for ${factor_publicKey.slice(-8)}`);

  await client.mutate({
    mutation: DELETE_FACTOR,
    variables: {
      id: factor_id,
    },
  });

  window.location.reload();
}
