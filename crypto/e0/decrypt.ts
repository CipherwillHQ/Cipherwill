import * as torusecc from "@toruslabs/eccrypto";

export default async function decrypt(
  private_key: string,
  ciphertext: Buffer,
  ephemPublicKey: Buffer,
  iv: Buffer,
  mac: Buffer
) {
  const decrypted = await torusecc.decrypt(Buffer.from(private_key, "hex"), {
    ciphertext,
    ephemPublicKey,
    iv,
    mac,
  });
  return decrypted.toString();
}
