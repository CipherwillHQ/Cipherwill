// GraphQL response type definitions

export interface MeData {
  me?: {
    id: string;
    email: string;
    email_verified: boolean;
    first_name: string;
    middle_name?: string;
    last_name: string;
    birth_date: string;
    gender: string;
    country: string;
    plan: string;
    last_accessed: string;
    created_at: string;
    updated_at: string;
  };
}

export interface SubscriptionData {
  getMySubscription?: {
    id: string;
    payment_gateway: string;
    plan_name: string;
    status: string;
    next_billing_at?: string;
    last_payment_method?: string;
    created_at: string;
    updated_at: string;
    cancel_at?: string;
  };
}

export interface UserPhoneNumber {
  id: string;
  phone_code: string;
  phone_num: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetUserPhoneNumbersData {
  getUserPhoneNumbers: UserPhoneNumber[];
}

export interface AddUserPhoneNumberVariables {
  phone_code: string;
  phone_num: string;
}

export interface AddUserPhoneNumberData {
  addUserPhoneNumber: boolean;
}

export interface RemoveUserPhoneNumberVariables {
  id: string;
}

export interface RemoveUserPhoneNumberData {
  removeUserPhoneNumber: boolean;
}

export interface SendUserPhoneVerificationCodeVariables {
  id: string;
}

export interface SendUserPhoneVerificationCodeData {
  sendUserPhoneVerificationCode: boolean;
}

export interface VerifyUserPhoneNumberVariables {
  id: string;
  otp: string;
}

export interface VerifyUserPhoneNumberData {
  verifyUserPhoneNumber: boolean;
}
