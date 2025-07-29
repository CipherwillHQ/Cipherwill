import { ApolloClient } from "@apollo/client";
import toast from "react-hot-toast";
import decrypt from "../../crypto/e0/decrypt";
import encrypt from "../../crypto/e0/encrypt";
import logger from "../debug/logger";
import { debug_sleep } from "../time/debug_sleep";
import recurring_upload from "../data/recurring_upload";
import GET_BENEFICIARY_FACTORS from "../../graphql/ops/auth/queries/GET_BENEFICIARY_FACTORS";
import GET_KEY_ITEMS_BY_PUBLIC_KEY from "../../graphql/ops/app/key/Queries/GET_KEY_ITEMS_BY_PUBLIC_KEY";
import DELETE_ALL_KEYS_FOR_BENEFICIARY from "../../graphql/ops/app/key/Mutations/DELETE_s";
import { Key } from "../data/types";

async function data_for_beneficiary(
  data: string,
  publicKey: string
): Promise<string> {
  return await encrypt(publicKey, Buffer.from(data), true);
}

export default async function perform_migrate_in(
  max_public_key: string,
  client: ApolloClient<any>,
  encrypt_for_public_key: string,
  privateKey: string | null,
  beneficiary_id?: string
) {
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
    });
    if (!beneficiary_factors) {
      toast.error("Invalid beneficiary");
      return;
    }
  }
  while (has_more) {
    logger.info(`Migrate in for cursor:${cursor} and has_more:${has_more}`);
    await debug_sleep(5000);
    // download all from max one
    let vars: any = {
      publicKey: max_public_key,
    };
    if (beneficiary_id) {
      // clear all existing keys for this beneficiary
      await client.mutate({
        mutation: DELETE_ALL_KEYS_FOR_BENEFICIARY,
        variables: {
          beneficiary_id,
        },
      });
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

    const all_data = res.data.getKeyItemsByPublicKey.items;
    // decrypt each one with current privatekey
    const all_decrypted:any[] = [];
    for await (const item of all_data) {
      if (item.publicKey !== "null") {
        if (privateKey === null) {
          toast.error(
            "Private key not provided to decrypt the data. Skipping Migrate In"
          );
          break;
        }
        const decrypted_string = JSON.parse(item.key);
        all_decrypted.push({
          ref_id: item.ref_id,
          beneficiary_id: item.beneficiary_id,
          key: await decrypt(
            privateKey,
            Buffer.from(decrypted_string.ciphertext, "base64"),
            Buffer.from(decrypted_string.ephemPublicKey, "base64"),
            Buffer.from(decrypted_string.iv, "base64"),
            Buffer.from(decrypted_string.mac, "base64")
          ),
        });
      } else {
        all_decrypted.push({
          ref_id: item.ref_id,
          beneficiary_id: item.beneficiary_id,
          key: item.key,
        });
      }
    }

    const re_encrypted_data: Key[] = [];
    // encrypt for this one
    for await (const item of all_decrypted) {
      if (beneficiary_id && beneficiary_factors) {
        const beneficiary = beneficiary_factors.data.getBeneficiaryFactors.find(
          (x) => x.beneficiary_id === beneficiary_id
        );

        if (beneficiary) {
          if (beneficiary.factors.length === 0) {
            re_encrypted_data.push({
              beneficiary_id: beneficiary_id,
              ref_id: item.ref_id,
              publicKey: "null",
              key: await data_for_beneficiary(item.key, beneficiary.publicKey),
            });
          } else {
            for await (const factor of beneficiary.factors) {
              re_encrypted_data.push({
                beneficiary_id: beneficiary_id,
                ref_id: item.ref_id,
                publicKey: factor.publicKey,
                key: await encrypt(
                  factor.publicKey,
                  Buffer.from(
                    await data_for_beneficiary(item.key, beneficiary.publicKey)
                  )
                ),
              });
            }
          }
        } else {
          logger.error("Invalid beneficiary ID", beneficiary_id);
        }
      } else {
        re_encrypted_data.push({
          ref_id: item.ref_id,
          publicKey: encrypt_for_public_key,
          beneficiary_id: item.beneficiary_id,
          key:
            encrypt_for_public_key === "null"
              ? item.key
              : await encrypt(encrypt_for_public_key, Buffer.from(item.key)),
        });
      }
    }
    logger.info(`Processed ${re_encrypted_data.length} items`);
    // upload all
    await recurring_upload({
      client,
      key_cluster: re_encrypted_data,
    });
  }
}
