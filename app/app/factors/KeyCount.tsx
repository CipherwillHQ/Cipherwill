"use client";

import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import DELETE_KEY_BY_PUBLIC_KEY from "../../../graphql/ops/app/key/Mutations/DELETE_KEY_BY_PUBLIC_KEY";
import GET_ALL_KEY_COUNT from "../../../graphql/ops/app/key/Queries/GET_ALL_KEY_COUNT";
import { GetAllKeyCountQuery, DeleteKeyByPublicKeyMutation, DeleteKeyByPublicKeyVariables } from "../../../types/interfaces";

export default function KeyCount() {
  const [getKeyCount, { data, loading, error }] = useLazyQuery<GetAllKeyCountQuery>(GET_ALL_KEY_COUNT);

  const [deleteKeyForPublicKey] = useMutation<DeleteKeyByPublicKeyMutation, DeleteKeyByPublicKeyVariables>(DELETE_KEY_BY_PUBLIC_KEY, {
    refetchQueries: [
      {
        query: GET_ALL_KEY_COUNT,
      },
    ],
  });

  const { unencrypted_key_count, max_key_count } = useMemo(() => {
    const counts = data?.getAllKeyCount ?? [];
    const current = counts.find((c) => c.publicKey === "null");
    let maxCount = 0;
    for (const c of counts) {
      if (c.publicKey !== "null" && c.count >= maxCount) {
        maxCount = c.count;
      }
    }
    return {
      unencrypted_key_count: current ? current.count : 0,
      max_key_count: maxCount,
    };
  }, [data]);

  useEffect(() => {
    getKeyCount().catch((error) => {
      console.error('Failed to get key count:', error);
    });
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
              }).then(() => {
                toast.success("Delete all unencrypted keys!!!");
              }).catch((error) => {
                console.error('Failed to delete keys:', error);
                toast.error("Failed to delete keys");
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
