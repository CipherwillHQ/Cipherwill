// Fetches encrypted file bytes from an authorized presigned download URL.
// Owns HTTP validation and the existing base64 representation.
// Does not decrypt files or save them to native storage.
export async function fetchEncryptedFile(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw Error(`Failed to download file: ${response.status} ${response.statusText}`);
  return Buffer.from(await response.arrayBuffer()).toString("base64");
}
