// Normalizes a query parameter to its first supplied value.
// Keeps server rendering and metadata consistent for repeated parameters.
// Does not validate or interpret the selected value.
export default function getSingleSearchParam(
  value?: string | string[],
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
