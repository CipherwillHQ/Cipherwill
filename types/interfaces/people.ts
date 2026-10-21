// What it does: Defines people query and invitation response contracts.
// What it owns: Person references and accurate invitation-email outcome fields.
// What it does NOT do: Send invitations or verify email addresses.

export interface Person {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  __typename?: "User" | "Guest";
}

export interface GetPersonByIdsData {
  getPersonByIds: Person[];
}

export interface GetPersonByIdsVariables {
  list: string[];
}

export interface InviteUserData {
  inviteUser: Person & { invitation_email: InvitationEmailResult };
}

export interface InvitationEmailResult {
  status: "sent" | "failed" | "already_sent" | "skipped";
  reason?: string | null;
}

export interface InviteUserVariables {
  first_name: string;
  email: string;
  send_email?: boolean;
  anonymous_invite?: boolean;
}

export interface DeleteSmartWillFriendData {
  deleteSmartWillFriend: boolean;
}

export interface DeleteSmartWillFriendVariables {
  id: string;
}

export interface DeleteSmartWillBeneficiaryData {
  deleteSmartWillBeneficiary: boolean;
}

export interface DeleteSmartWillBeneficiaryVariables {
  id: string;
}

export interface SearchPersonData {
  searchPerson: Person[];
}

export interface SearchPersonVariables {
  email: string;
}

export interface PersonSearchResultsProps {
  people: Person[];
  field: string | null;
  response: (response: import("@/types/Will").PersonRef) => void;
  onClose: () => void;
  onInvite: (person: Person) => void;
}
