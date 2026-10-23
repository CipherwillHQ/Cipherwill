// Validates calendar dates against optional catalog constraints.
// Owns ISO date parsing and explicit minimum/maximum checks.
// Does not impose birth-date rules on other date questions.
export function isGuidanceDateValid(value: string, minimum?: string, maximum?: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;
  const upper = maximum === "today" ? new Date().toISOString().slice(0, 10) : maximum;
  const lower = minimum === "today" ? new Date().toISOString().slice(0, 10) : minimum;
  return (!lower || value >= lower) && (!upper || value <= upper);
}
