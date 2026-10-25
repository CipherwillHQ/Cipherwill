// Provides the download action for an executor-granted storage object.
// Owns progress feedback and failures during file export.
// Does not decrypt data or implement native file storage.
"use client";

import logger from "@/common/debug/logger";
import SimpleButton from "@/components/common/SimpleButton";
import { useSession } from "@/contexts/SessionContext";
import { useApolloClient } from "@apollo/client/react";
import toast from "react-hot-toast";
import downloadGrantedFile from "./downloadGrantedFile";

export default function DownloadGrantedObject({
  access_id,
  ref_id,
}: {
  access_id: string;
  ref_id: string;
}) {
  const { session } = useSession();
  const client = useApolloClient();
  return (
    <SimpleButton
      onClick={async () => {
        toast.success("Downloading object... Please wait");
        try {
          await downloadGrantedFile({client, session, id: ref_id, access_id});
        } catch (error) {
          logger.error("Unable to download granted file", error);
          toast.error("Unable to download this file. Please try again.");
        }
      }}
    >
      Download Object
    </SimpleButton>
  );
}
