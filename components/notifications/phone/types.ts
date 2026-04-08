import { GetUserPhoneNumbersData } from "@/types/graphql";

export type UserPhoneNumber = GetUserPhoneNumbersData["getUserPhoneNumbers"][number];

export type PhoneToRemove = {
  id: string;
  display: string;
};
