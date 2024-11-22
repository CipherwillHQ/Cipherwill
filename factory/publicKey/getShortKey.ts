export default function getShortKey(publicKey: string) {
  return publicKey
    .substring(publicKey.length - 8, publicKey.length)
    .toUpperCase();
}
