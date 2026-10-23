// Supplies small catalog definitions and services for runtime regression tests.
// Owns independent local/server fixtures with overridable service boundaries.
// Does not register production objectives or perform network calls.
import type { GuidanceDefinition, GuidanceServices, GuidanceAccount } from "@/types/interfaces";
import { choiceServices } from "./choices";
export const runtimeAccount: GuidanceAccount = { firstName: null, lastName: null, birthDate: null, beneficiaryCount: 0 };
export function runtimeFlow(id: string, overrides: Partial<GuidanceDefinition> = {}): GuidanceDefinition {
  return { id, title: id, description: "Set up your account", priority: 1, skippable: true,
    steps: [{ id: "confirm", title: "Continue?", subtext: "Choose", input: { key: "confirmed", type: "boolean" } }],
    completion: { mode: "local", fields: [], title: "Done", subtext: "Continue" }, ...overrides };
}
export function runtimeServices(catalog: GuidanceDefinition[], overrides: Partial<GuidanceServices> = {}): GuidanceServices {
  return { ...choiceServices, loadAccount: async () => ({ ...runtimeAccount }), loadCatalog: async () => catalog,
    loadContext: async () => ({}), runOperation: async () => null,
    completeObjective: async () => ({ status: "complete", beneficiaryPersonId: null }), ...overrides };
}
