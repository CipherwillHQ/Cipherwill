import toast from "react-hot-toast";
import perform_migrate_out from "./perform_migrate_out";
import { ApolloClient } from "@apollo/client";
import DELETE_FACTOR from "../../graphql/ops/auth/mutations/DELETE_FACTOR";
import { sleep } from "../time/sleep";
import DELETE_KEY_BY_PUBLIC_KEY from "../../graphql/ops/app/key/Mutations/DELETE_KEY_BY_PUBLIC_KEY";

export default async function remove_factor(
  client: ApolloClient,
  session_publicKey: string,
  session_privateKey: string,
  factor_id: string,
  factor_publicKey: string
) {
  if (session_publicKey === factor_publicKey) {
    // migrate out
    // delete factor

    await perform_migrate_out(client, factor_publicKey, session_privateKey);

    // Wait for 1.5 sec
    await sleep(1500);
    
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
  } else {
    toast.error("You need to login with the factor you want to remove");
  }
}
