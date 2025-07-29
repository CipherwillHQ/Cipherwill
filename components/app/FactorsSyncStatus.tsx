"use client";

import { useApolloClient, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useSession } from "../../contexts/SessionContext";
import toast from "react-hot-toast";
import perform_migrate_in from "../../common/factor/perform_migrate_in";
import { sleep } from "../../common/time/sleep";
import Link from "next/link";
import { BiCheckShield } from "react-icons/bi";
import DELETE_KEY_BY_PUBLIC_KEY from "../../graphql/ops/app/key/Mutations/DELETE_KEY_BY_PUBLIC_KEY";
import GET_ALL_KEY_COUNT from "../../graphql/ops/app/key/Queries/GET_ALL_KEY_COUNT";
import DevOnly from "../debug/DevOnly";

export default function FactorsSyncStatus() {
  const { session, lock } = useSession();
  const client = useApolloClient();
  const [isMigrating, setIsMigrating] = useState(false);

  const [unencrypted_keys_count, set_unencrypted_data_count] = useState(0);
  const [maxPublicKeysList, setMaxPublicKeysList] = useState<any[]>([]);
  const [max_keys, set_max_keys] = useState({
    count: 0,
    publicKey: "null",
  });

  const [getKeyCount, { data, loading, error }] = useLazyQuery(
    GET_ALL_KEY_COUNT,
    {
      onCompleted: async (data) => {
        if (data && data.getAllKeyCount) {
          const current = data.getAllKeyCount.find(
            (c) => c.publicKey === "null"
          );
          set_unencrypted_data_count(current ? current.count : 0);

          let maxCount = 0;
          let maxPublicKey = "null";
          let maxKeyList:any[] = [];
          for await (const c of data.getAllKeyCount) {
            if (c.count >= maxCount) {
              maxCount = c.count;
              maxPublicKey = c.publicKey;
              maxKeyList.push(c.publicKey);
            }
          }
          set_max_keys({
            count: maxCount,
            publicKey: maxPublicKey,
          });
          setMaxPublicKeysList(maxKeyList);
        }
      },
    }
  );
  const [deleteDataForPublicKey] = useMutation(DELETE_KEY_BY_PUBLIC_KEY, {
    onCompleted(data, clientOptions) {
      toast.success("Delete all unencrypted data!!!");
    },
    refetchQueries: [
      {
        query: GET_ALL_KEY_COUNT,
      },
    ],
  });

  useEffect(() => {
    getKeyCount();
  }, [getKeyCount]);

  const currentPublicKey =
    session && session.publicKey ? session.publicKey : "null";

  const is_all_in_sync =
    data && data.getAllKeyCount
      ? data.getAllKeyCount.every(
          (c) => c.count === max_keys.count || c.publicKey === "null"
        )
      : false;

  const is_insucure =
    data && data.getAllKeyCount && data.getAllKeyCount.length === 1;

  if (loading) return null;
  if (is_insucure)
    return (
      <DevOnly>
        <div className="border border-red-500 rounded-md p-2 flex items-center justify-between h-min">
          <div className="text-red-800 text-sm">
            Profile is not Zero Knowledge(ZK-ENC) Protected
          </div>
          <Link href={"/app/factors"}>
            <button className="bg-orange-200 hover:bg-orange-300 text-sm px-3 py-1 rounded-full mx-2 whitespace-nowrap">
              Add Factor
            </button>
          </Link>
        </div>
      </DevOnly>
    );

  return (
    <div>
      <div className="flex items-center justify-between py-2">
        <h2 className="font-semibold">Factor Synchronization Status </h2>
        <div
          className={`text-xs ${
            is_all_in_sync
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
          } p-1 rounded-full px-4`}
        >
          {is_all_in_sync ? "In Sync" : "Not in Sync"}
        </div>
      </div>
      {maxPublicKeysList.length > 1 &&
        unencrypted_keys_count > 0 &&
        is_all_in_sync && (
          <div className="flex items-center justify-between border p-2 rounded-md">
            <div>You've some insecure data that you need to delete</div>
            <button
              className="flex items-center px-4 py-1 rounded-full text-sm bg-red-100 hover:bg-red-200 text-red-500 whitespace-nowrap"
              onClick={() => {
                const cnf = confirm(
                  "Are you sure you want to delete all unencrypted data?"
                );
                if (cnf) {
                  // send deletion request for public key null
                  deleteDataForPublicKey({
                    variables: {
                      publicKey: "null",
                    },
                  });
                }
              }}
            >
              Delete
            </button>
          </div>
        )}
      {data &&
        data.getAllKeyCount.map((c) => {
          if (c.publicKey === "null") return null;
          return (
            <div
              key={c.publicKey}
              className="border border-default bg-secondary p-2 my-2 rounded-md flex items-center justify-between"
            >
              <div>Factor {c.publicKey.slice(-8).toUpperCase()}</div>
              <div>
                {c.count < unencrypted_keys_count ? (
                  <button
                    className="flex items-center px-4 py-1 rounded-full text-sm bg-blue-100 hover:bg-blue-200 text-blue-500 whitespace-nowrap"
                    onClick={async () => {
                      setIsMigrating(true);

                      toast.success(
                        `Migration Started from -> Unencrypted Vault`
                      );
                      await perform_migrate_in(
                        "null",
                        client,
                        c.publicKey,
                        session ? session.privateKey : null
                      );
                      // refetch query
                      await client.query({
                        query: GET_ALL_KEY_COUNT,
                        fetchPolicy: "network-only",
                      });
                      await sleep(1000);
                      // delete all unencrypted data
                      await deleteDataForPublicKey({
                        variables: {
                          publicKey: "null",
                        },
                      });
                      setIsMigrating(false);
                      toast.success(
                        `Migration Completed from -> Unencrypted Vault`
                      );
                    }}
                  >
                    {isMigrating && (
                      <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-blue-500 mr-2" />
                    )}
                    Needs Migration
                  </button>
                ) : (
                  c.count < max_keys.count &&
                  (max_keys.publicKey !== currentPublicKey ? (
                    <button
                      className="bg-red-200 hover:bg-red-300 p-1 text-xs rounded-full text-red-700 px-2"
                      onClick={() => {
                        toast.error(
                          `Start Session with Factor key ${max_keys.publicKey
                            .slice(-8)
                            .toUpperCase()} to start migration`
                        );
                      }}
                    >
                      Switch Factor
                    </button>
                  ) : (
                    <button
                      className="flex items-center px-4 py-1 rounded-full text-sm bg-blue-100 hover:bg-blue-200 text-blue-500 whitespace-nowrap"
                      onClick={async () => {
                        setIsMigrating(true);

                        toast.success(
                          `Migration Started from -> ${max_keys.publicKey.slice(
                            -8
                          )}`
                        );
                        await perform_migrate_in(
                          max_keys.publicKey,
                          client,
                          c.publicKey,
                          session ? session.privateKey : null
                        );
                        // refetch query
                        await client.query({
                          query: GET_ALL_KEY_COUNT,
                          fetchPolicy: "network-only",
                        });
                        setIsMigrating(false);

                        toast.success(
                          `Migration Completed from -> ${max_keys.publicKey.slice(
                            -8
                          )}`
                        );
                      }}
                    >
                      {isMigrating && (
                        <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-blue-500 mr-2" />
                      )}
                      Needs Migration
                    </button>
                  ))
                )}

                {c.count >= max_keys.count && (
                  <div className="text-green-700 p-1">
                    <BiCheckShield size={20} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
