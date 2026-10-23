// Provides a serializable sample catalog for standalone frontend tests.
// Owns test-only profile and beneficiary branches resembling the public API.
// Does not register production objectives or import backend code.
import type { GuidanceDefinition } from "@/types/interfaces";

const profileFields = ["firstName", "lastName", "birthDate"];
const profileIds = ["add_first_name", "add_last_name", "add_user_birthdate"];
const guest = { path: "effects.person", operator: "missing" } as const;

export const testCatalog: GuidanceDefinition[] = [
  ...profileFields.map((field, index): GuidanceDefinition => ({
    id: profileIds[index], title: field, description: "Complete your profile", priority: index, skippable: false,
    completedWhen: { path: `account.${field}`, operator: "present" },
    steps: [{ id: field, title: `Enter ${field}`, subtext: "Complete your profile",
      input: field === "birthDate" ? { key: field, type: "date", minDate: "1900-01-01", maxDate: "today" }
        : { key: field, type: "single_line_text", minLength: 2, maxLength: 50 } }],
    completion: { mode: "server", fields: [field], title: "Saved", subtext: "Continue", displayForMs: 3000,
      updateAccount: { [field]: { path: `answers.${field}` } } },
  })),
  { id: "add_beneficiary", title: "Add beneficiary", description: "Add a beneficiary", priority: 3, skippable: false,
    contexts: ["assets"], completedWhen: { path: "account.beneficiaryCount", operator: "gt", value: 0 },
    steps: [
      { id: "email", title: "Email?", subtext: "Receive access to {{context.assets.label}}",
        input: { key: "email", type: "email" } },
      { id: "lookup", title: "Checking", subtext: "Please wait",
        effect: { id: "person", type: "lookup_person", args: { email: { path: "answers.email" } } } },
      { id: "guest_notice", when: guest, title: "No account", subtext: "Create a guest" },
      { id: "firstName", when: guest, title: "Name?", subtext: "Guest name",
        input: { key: "firstName", type: "single_line_text", minLength: 3, maxLength: 50 } },
      { id: "sendInvite", when: guest, title: "Invite?", subtext: "Send invitation", input: { key: "sendInvite", type: "boolean" } },
      { id: "anonymousInvite", when: { all: [guest, { path: "answers.sendInvite", operator: "equals", value: true }] },
        title: "Anonymous?", subtext: "Hide identity", input: { key: "anonymousInvite", type: "boolean" } },
    ],
    completion: { mode: "server", fields: ["email", "firstName", "sendInvite", "anonymousInvite"],
      title: "Added", subtext: "Syncing", displayForMs: 3000, updateAccount: { beneficiaryCount: { literal: 1 } },
      actions: [{ id: "migrate", type: "migrate_beneficiary", args: { personId: { path: "completion.beneficiaryPersonId" } } }] },
  },
];
