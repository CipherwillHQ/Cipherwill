// Saves a completed file through native dialogs or the existing browser download.
// Owns bounded native chunks and cancellation of incomplete transfers.
// Does not decrypt files or transfer encryption keys to native code.
import { getMobileAuthBridge } from "@/common/auth/mobileAuthBridge";
import { requestDevice } from "./deviceBridge";
export async function saveFile(blob: Blob, name: string): Promise<boolean> {
  if (!getMobileAuthBridge()) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = url;
    link.download = name;
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return true;
  }
  await requestDevice("download-start", { name, size: blob.size, mime: blob.type || "application/octet-stream" });
  try {
    for (let offset = 0; offset < blob.size; offset += 49152) {
      const bytes = new Uint8Array(await blob.slice(offset, offset + 49152).arrayBuffer());
      await requestDevice("download-chunk", { data: btoa(String.fromCharCode(...bytes)) });
    }
    return await requestDevice<boolean>("download-finish", {}, 300000);
  } catch (error) {
    await requestDevice("download-cancel").catch(() => {});
    throw error;
  }
}
