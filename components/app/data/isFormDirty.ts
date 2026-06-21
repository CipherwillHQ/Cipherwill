// Normalizes undefined/null/empty values for comparison, then checks if two objects differ.
// Treats undefined, null, "" and [] as equivalent (empty).
export function isFormDirty<T extends Record<string, unknown>>(
  current: T,
  initial: T | null
): boolean {
  if (!initial) return false;

  function norm(v: unknown): unknown {
    if (v === undefined || v === null) return "";
    if (Array.isArray(v) && v.length === 0) return "";
    return v;
  }

  const keys = new Set([...Object.keys(current), ...Object.keys(initial)]);
  for (const k of keys) {
    if (JSON.stringify(norm(current[k])) !== JSON.stringify(norm(initial[k]))) {
      return true;
    }
  }
  return false;
}
