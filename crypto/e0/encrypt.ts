import * as torusecc from "@toruslabs/eccrypto"; // Only secp256k1 curve is supported

// Every datapod is encrypted with E1 encryption as this is the time capsule encryption
// Only if beneficiary has factors then we encrypt with E0 encryption
// E0 is used for encrypting the key for the beneficiary factors

export default async function encrypt(
  public_key: string,
  data: Buffer,
  level_2: Boolean = false
) {
  const encrypted = await torusecc.encrypt(
    Buffer.from(public_key, "hex"),
    data
  );

  const encrypted_string = JSON.stringify({
    type: level_2 ? "E1" : "E0",
    ciphertext: encrypted.ciphertext.toString("base64"),
    ephemPublicKey: encrypted.ephemPublicKey.toString("base64"),
    iv: encrypted.iv.toString("base64"),
    mac: encrypted.mac.toString("base64"),
  });
  return encrypted_string;
}
