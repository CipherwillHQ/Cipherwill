import * as torusecc from "@toruslabs/eccrypto";

export default async function decrypt(
  private_key: string,
  ciphertext: Buffer,
  ephemPublicKey: Buffer,
  iv: Buffer,
  mac: Buffer
) {
  // console.log("private key *******************", private_key);
  const decrypted = await torusecc.decrypt(Buffer.from(private_key, "hex"), {
    ciphertext,
    ephemPublicKey,
    iv,
    mac,
  });
  // eccrypto v7 returns Uint8Array (not Buffer), so decode via Buffer for stable UTF-8 string output.
  return Buffer.from(decrypted).toString("utf8");
}
