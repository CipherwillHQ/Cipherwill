// Formats a person's display name with an email fallback.
// Owns the shared name label used in beneficiary lists and details.
// Does not fetch people or infer account status.

import type { Person } from "@/types/interfaces";

export default function getPersonDisplayName(person: Person) {
  return [person.first_name, person.last_name].filter(Boolean).join(" ").trim() || person.email;
}
