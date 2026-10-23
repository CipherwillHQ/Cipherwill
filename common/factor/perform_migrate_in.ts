// Migrates owner keys into another factor or beneficiary with cancellation.
// Owns guarded reads, key transformations, and bounded uploads.
// Does not choose guidance objectives or persist private keys.
import { ApolloClient } from "@apollo/client";
import toast from "react-hot-toast";
import logger from "../debug/logger";
import { debug_sleep } from "../time/debug_sleep";
import recurring_upload from "../data/recurring_upload";
import GET_BENEFICIARY_FACTORS from "../../graphql/ops/auth/queries/GET_BENEFICIARY_FACTORS";
import GET_KEY_ITEMS_BY_PUBLIC_KEY from "../../graphql/ops/app/key/Queries/GET_KEY_ITEMS_BY_PUBLIC_KEY";
import DELETE_ALL_KEYS_FOR_BENEFICIARY from "../../graphql/ops/app/key/Mutations/DELETE_s";
import { transformMigrationKeys } from "./transformMigrationKeys";

export default async function perform_migrate_in(
  max_public_key: string,
  client: ApolloClient,
  encrypt_for_public_key: string,
  privateKey: string | null,
  beneficiary_id?: string,
  signal?: AbortSignal
) {
  signal?.throwIfAborted();
  logger.info(
    `Performing migrate in for ${
      beneficiary_id
        ? ` beneficiary -> ${beneficiary_id}`
        : `public key -> ${encrypt_for_public_key}`
    }`
  );
  let cursor = undefined;
  let has_more = true;
  let beneficiary_factors: any = undefined;
  if (beneficiary_id) {
    beneficiary_factors = await client.query({
      query: GET_BENEFICIARY_FACTORS,
      fetchPolicy: "network-only"
    });
    signal?.throwIfAborted();
    if (!beneficiary_factors) {
      toast.error("Invalid beneficiary");
      return;
    }
    // clear existing beneficiary keys once before paginated migration starts
    await client.mutate({
      mutation: DELETE_ALL_KEYS_FOR_BENEFICIARY,
      variables: {
        beneficiary_id,
      },
    });
  }
  while (has_more) {
    signal?.throwIfAborted();
    logger.info(`Migrate in for cursor:${cursor} and has_more:${has_more}`);
    await debug_sleep(5000, signal);
    signal?.throwIfAborted();
    // download all from max one
    let vars: any = {
      publicKey: max_public_key,
    };
    if (beneficiary_id) {
      vars = {
        ...vars,
        for_beneficiary_migration: true,
      };
    }
    if (cursor) {
      vars = {
        ...vars,
        cursor,
      };
    }
    const res: any = await client.query({
      query: GET_KEY_ITEMS_BY_PUBLIC_KEY,
      fetchPolicy: "network-only",
      variables: vars,
    });
    signal?.throwIfAborted();
    const items = res?.data?.getKeyItemsByPublicKey?.items || [];
    if (items.length < 1) {
      toast.error("No data items to migrate");
      has_more = false;
      break;
    }

    if (res?.data?.getKeyItemsByPublicKey?.has_more) {
      has_more = res.data.getKeyItemsByPublicKey.has_more;
      cursor = items[items.length - 1].id;
    } else {
      has_more = false;
    }

    const re_encrypted_data = await transformMigrationKeys(items, privateKey, encrypt_for_public_key,
      beneficiary_id, beneficiary_factors?.data?.getBeneficiaryFactors, signal);
    logger.info(`Processed ${re_encrypted_data.length} items`);
    // upload all
    signal?.throwIfAborted();
    await recurring_upload({
      client,
      key_cluster: re_encrypted_data,
      signal,
    });
  }
}
