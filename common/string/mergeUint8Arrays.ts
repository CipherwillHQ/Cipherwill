export default function mergeUint8Arrays(
  array1: Uint8Array,
  array2: Uint8Array
): Uint8Array {
  const mergedArray = new Uint8Array(array1.length + array2.length);
  mergedArray.set(array1, 0); // Copy the first array starting at index 0
  mergedArray.set(array2, array1.length); // Copy the second array after the first
  return mergedArray;
}
