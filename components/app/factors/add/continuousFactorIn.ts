// Synchronizes existing vault keys into a newly created factor.
// Owns source-key cleanup only after migration completes.
// Does not create credentials or persist private keys.
import toast from "react-hot-toast";
import { runFactorOperation } from "@/common/mobile/runFactorOperation";
import { sleep } from "../../../../common/time/sleep";
import perform_migrate_in from "../../../../common/factor/perform_migrate_in";
import DELETE_KEY_BY_PUBLIC_KEY from "../../../../graphql/ops/app/key/Mutations/DELETE_KEY_BY_PUBLIC_KEY";
import GET_ALL_KEY_COUNT from "../../../../graphql/ops/app/key/Queries/GET_ALL_KEY_COUNT";

async function continuousFactorIn(data, client, session) {
  const reload = await runFactorOperation(async () => {
    if (data && data.createFactor) {
      const key_count = await client.query({
        query: GET_ALL_KEY_COUNT,
        fetchPolicy: "network-only",
      });
      let max_publicKey = "";
      let max = 0;
      for (let index = 0; index < key_count.data.getAllKeyCount.length; index++) {
        const element = key_count.data.getAllKeyCount[index];
        if (element.count > max) {
          max = element.count;
          max_publicKey = element.publicKey;
        }
      }

      if (max === 0) {
        // no data to migrate
        // just add factor and reload
        return true;
      }

      if (max_publicKey !== "null" && session.publicKey !== max_publicKey) {
        toast.error(
          "You need to login session with key " + max_publicKey.slice(-8)
        );
        return true;
      }

      if (max_publicKey === "null" || max_publicKey === session.publicKey) {
        toast.success(
          `Migration Started from -> ${
            max_publicKey === "null"
              ? "Unencrypted vault"
              : max_publicKey.slice(-8)
          }`
        );
        await perform_migrate_in(
          max_publicKey,
          client,
          data.createFactor.publicKey,
          session ? session.privateKey : null
        );

        toast.success(
          `Migration Completed from -> ${
            max_publicKey === "null"
              ? "Unencrypted vault"
              : max_publicKey.slice(-8)
          }`
        );
        await sleep(1000);
        // clear all unencrypted data
        if (max_publicKey === "null") {
          await client.mutate({
            mutation: DELETE_KEY_BY_PUBLIC_KEY,
            variables: {
              publicKey: "null",
            },
          });
          toast.success("Deleted all unencrypted data");
        }
        await sleep(1000);

        return true;
      } else {
        toast.error(`You need to login with factor key: ${max_publicKey}`);
        await sleep(2000);
        return true;
      }
    }
  });
  if (reload) window.location.reload();
}

export default continuousFactorIn;
