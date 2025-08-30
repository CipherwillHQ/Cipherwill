import { ApolloClient } from "@apollo/client";
import toast from "react-hot-toast";
import GET_FACTORS from "../../graphql/ops/auth/queries/AVAILABLE_AUTH_FACTORS";
import decrypt from "../../crypto/e0/decrypt";
import logger from "../debug/logger";
import { debug_sleep } from "../time/debug_sleep";
import recurring_upload from "../data/recurring_upload";
import DELETE_KEY_BY_PUBLIC_KEY from "../../graphql/ops/app/key/Mutations/DELETE_KEY_BY_PUBLIC_KEY";
import GET_KEY_ITEMS_BY_PUBLIC_KEY from "../../graphql/ops/app/key/Queries/GET_KEY_ITEMS_BY_PUBLIC_KEY";
import { Key } from "../data/types";
import { GetFactorsQuery } from "../../types/interfaces/metamodel";

export default async function perform_migrate_out(
  client: ApolloClient,
  publicKey: string,
  privateKey: string
) {
  // get factors count
  const factors = await client.query<GetFactorsQuery>({
    fetchPolicy: "network-only",
    query: GET_FACTORS,
  });
  
  if (!factors.data) {
    toast.error("Failed to fetch factors");
    return;
  }
  
  const all_factors = factors.data.getFactors;

  if (all_factors.length > 1) {
    // delete by public key
    await client.mutate({
      mutation: DELETE_KEY_BY_PUBLIC_KEY,
      variables: {
        publicKey,
      },
    });
  } else if (all_factors.length === 1) {
    let cursor = undefined;
    let has_more = true;
    while (has_more) {
      logger.info(`Migrate out for cursor:${cursor} and has_more:${has_more}`);
      await debug_sleep(5000);

      // download all from max one
      const res: any = await client.query({
        query: GET_KEY_ITEMS_BY_PUBLIC_KEY,
        fetchPolicy: "network-only",
        variables: cursor
          ? {
              publicKey,
              cursor,
            }
          : {
              publicKey,
            },
      });
      if (
        !res.data &&
        !res.data.getKeyItemsByPublicKey &&
        !res.data.getKeyItemsByPublicKey.items &&
        res.data.getKeyItemsByPublicKey.items.length < 1
      ) {
        toast.error("No data items to migrate");
        has_more = false;
        break;
      }

      if (res.data.getKeyItemsByPublicKey.has_more) {
        has_more = res.data.getKeyItemsByPublicKey.has_more;
        cursor =
          res.data.getKeyItemsByPublicKey.items[
            res.data.getKeyItemsByPublicKey.items.length - 1
          ].id;
      } else {
        has_more = false;
      }

      const all_keys = res.data.getKeyItemsByPublicKey.items;
      // decrypt each one with current privatekey
      const all_decrypted: Key[] = [];
      for await (const item of all_keys) {
        const encrypted_string = JSON.parse(item.key);
        all_decrypted.push({
          ref_id: item.ref_id,
          beneficiary_id: item.beneficiary_id,
          publicKey: "null",
          key: await decrypt(
            privateKey,
            Buffer.from(encrypted_string.ciphertext, "base64"),
            Buffer.from(encrypted_string.ephemPublicKey, "base64"),
            Buffer.from(encrypted_string.iv, "base64"),
            Buffer.from(encrypted_string.mac, "base64")
          ),
        });

        // throw new Error("Not implemented");
      }
      logger.info(`Processed ${all_decrypted.length} items`);

      // upload all
      await recurring_upload({
        client,
        key_cluster: all_decrypted,
      });
    }
  } else {
    toast.error("No factors to migrate out");
  }
}
