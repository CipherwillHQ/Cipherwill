// People and user-related interfaces

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
  inviteUser: Person;
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
