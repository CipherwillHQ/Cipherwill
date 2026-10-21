// What it does: Lists matching people with an invitation action for existing guests.
// What it owns: Person selection and reopening the first-invitation or retry form.
// What it does NOT do: Send email or decide whether the guest allowance is consumed.

import { FiUser } from "react-icons/fi";
import type { PersonSearchResultsProps } from "@/types/interfaces";

export default function PersonSearchResults({ people, field, response, onClose, onInvite }: PersonSearchResultsProps) {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {people.map((person) => (
        <div key={person.id} className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
          <button type="button" className="w-full flex items-center gap-3 text-left cursor-pointer"
            data-cy="person-item" onClick={() => { response({ person: person.id, field }); onClose(); }}>
            <span className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FiUser className="text-blue-600 dark:text-blue-400" size={18} />
            </span>
            <span className="flex-1">
              <span data-cy="person-name" className="block font-medium text-gray-900 dark:text-white">{person.first_name}</span>
              <span data-cy="person-email" className="block text-sm text-gray-600 dark:text-gray-400">{person.email}</span>
            </span>
          </button>
          {person.__typename === "Guest" && (
            <button type="button" onClick={() => onInvite(person)} data-cy="invite-existing-guest"
              className="mt-2 text-sm text-blue-700 dark:text-blue-300 hover:underline">
              Send or retry invitation email
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
