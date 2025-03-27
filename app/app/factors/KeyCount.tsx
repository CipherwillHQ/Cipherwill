"use client";

import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DELETE_KEY_BY_PUBLIC_KEY from "../../../graphql/ops/app/key/Mutations/DELETE_KEY_BY_PUBLIC_KEY";
import GET_ALL_KEY_COUNT from "../../../graphql/ops/app/key/Queries/GET_ALL_KEY_COUNT";

export default function KeyCount() {
  const [unencrypted_key_count, set_unencrypted_key_count] = useState(0);
  const [max_key_count, set_max_key_count] = useState(0);

  const [getKeyCount, { data, loading, error }] = useLazyQuery(GET_ALL_KEY_COUNT, {
    onCompleted: async (data) => {
      if (data && data.getAllKeyCount) {
        const current = data.getAllKeyCount.find((c) => c.publicKey === "null");
        set_unencrypted_key_count(current ? current.count : 0);

        let maxCount = 0;
        for await (const c of data.getAllKeyCount) {
          if (c.count >= maxCount && c.publicKey !== "null") {
            maxCount = c.count;
          }
        }
        set_max_key_count(maxCount);
      }
    },
  });

  const [deleteKeyForPublicKey] = useMutation(DELETE_KEY_BY_PUBLIC_KEY, {
    onCompleted(data, clientOptions) {
      toast.success("Delete all unencrypted keys!!!");
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="border border-default p-2 my-2 rounded-sm flex items-center justify-between bg-secondary">
      <div className="flex items-center justify-between w-full">
        <div className="">
          Total data count (not encrypted)
        </div>
        <div>{unencrypted_key_count}</div>
      </div>

      {unencrypted_key_count > 0 && max_key_count >= unencrypted_key_count && (
        <button
          className="flex items-center ml-2 px-2 py-1 rounded-full text-sm bg-red-100 hover:bg-red-200 text-red-500 whitespace-nowrap"
          onClick={() => {
            const cnf = confirm(
              "Are you sure you want to delete all unencrypted keys?"
            );
            if (cnf) {
              // send deletion request for public key null
              deleteKeyForPublicKey({
                variables: {
                  publicKey: "null",
                },
              });
            }
          }}
        >
          Delete Insecure Keys
        </button>
      )}
    </div>
  );
}
