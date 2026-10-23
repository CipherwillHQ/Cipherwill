// Saves a guided file selection through the shared encrypted pod uploader.
// Owns ordinary file metadata and forwards the original binary file for encryption.
// Does not read file contents into completion requests or retain selections.
import type { ApolloClient } from "@apollo/client";
import type { GuidanceFileAnswer, GuidanceSession } from "@/types/interfaces";
import { normalizeGuidanceFile } from "../core/fileAnswer";
import { saveGuidancePod } from "./saveGuidancePod";

const KNOWN_FILE_TYPES = ["text/plain", "image/png", "image/jpg", "image/jpeg", "image/gif", "video/mp4", "application/pdf"];

export async function saveGuidanceFile(client: ApolloClient, session: GuidanceSession | null,
  args: Record<string, unknown>, signal?: AbortSignal) {
  signal?.throwIfAborted();
  const { file } = normalizeGuidanceFile((args.file as GuidanceFileAnswer | undefined)?.file);
  return saveGuidancePod(client, session, { itemId: args.itemId as string, type: "FILE", version: "0.0.1", data: file,
    metadata: { title: file.name || "Untitled file", type: KNOWN_FILE_TYPES.includes(file.type) ? file.type : "unknown",
      file_ext: file.name.includes(".") ? file.name.split(".").pop()! : "" } }, signal);
}
