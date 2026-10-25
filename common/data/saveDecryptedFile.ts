// Decrypts stored AES-CBC file bytes in the web client and hands off the result.
// Owns the existing key layout and filename extension rules.
// Does not export encryption keys or change stored encryption formats.
import crypto from "crypto";
import { saveFile } from "@/common/mobile/saveFile";
import type { FileDownloadMetadata } from "@/types/interfaces";
const extensions: Record<string, string> = {
  "text/plain": ".txt", "image/png": ".png", "image/jpeg": ".jpg",
  "image/jpg": ".jpg", "video/mp4": ".mp4", "image/gif": ".gif",
};
export async function saveDecryptedFile(data: string, secret: string, metadata: FileDownloadMetadata): Promise<boolean> {
  const decipher = crypto.createDecipheriv("aes-256-cbc", secret.slice(16), secret.slice(0, 16));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]);
  const blob = new Blob([decrypted], { type: metadata.type });
  const suffix = metadata.file_ext ? "." + metadata.file_ext : extensions[metadata.type] ?? "";
  return saveFile(blob, metadata.title.endsWith(suffix) ? metadata.title : metadata.title + suffix);
}
