"use client";

import { bytesToReadable } from "@/common/storage/bytes_to_redable";
import GET_STORAGE_USED from "@/graphql/ops/auth/queries/GET_STORAGE_USED";
import { GetStorageUsedQuery } from "@/types";
import { useQuery } from "@apollo/client/react";
import { motion } from "framer-motion";
import { LuHardDrive } from "react-icons/lu";

export default function ApplicationUsage() {
  const { data, loading, error } =
    useQuery<GetStorageUsedQuery>(GET_STORAGE_USED);
  if (loading)
    return (
      <div className="p-4 w-full max-w-3xl">
        <div className="p-4 bg-secondary rounded-md border border-default">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  if (error) return <div>Error loading storage usage: {error.message}</div>;

  const storageUsed = data?.getStorageUsed;

  if (!storageUsed) {
    return <div>No storage usage data available</div>;
  }
  return (
      <motion.div
        className="max-w-3xl bg-secondary p-6 m-2 rounded-md border border-default"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 font-semibold text-lg flex items-center gap-2">
          <LuHardDrive className="w-5 h-5" />
          Storage Usage
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">Segments data usage:</span>
            <span className="text-blue-600 dark:text-blue-400">
              {bytesToReadable(parseInt(storageUsed.text_pods || "0"))}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Object storage usage:</span>
            <span className="text-blue-600 dark:text-blue-400">
              {bytesToReadable(parseInt(storageUsed.storage_pods || "0"))}
            </span>
          </div>
        </div>
      </motion.div>
    
  );
}
