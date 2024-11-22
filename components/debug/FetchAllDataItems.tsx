"use client";

import { useApolloClient } from "@apollo/client";
import getAllKeys from "../../factory/key/getAllKeys";

export default function FetchAllDataItems() {
  const client = useApolloClient();
  const publicKey = "null";

  return (
    <button
      className="text-xs border p-1 m-1 hover:bg-slate-200"
      onClick={async () => {
        await getAllKeys({
          client,
          maxPublicKey: publicKey,
        });
      }}
    >
      Fetch All Data Items
    </button>
  );
}
