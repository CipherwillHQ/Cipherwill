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

export interface GetMyInvoicesData {
  getMyInvoices?: {
    id: string;
    plan_name: string;
    status: string;
    amount: string;
    currency: string;
    created_at: string;
    updated_at: string;
  }[];
}

export interface GetInvoicePdfData {
  getInvoicePdf?: string;
}

export interface SmartWillBeneficiary {
  id: string;
  user_id: string;
  person_id: string;
  publicKey: string;
  custom_message: string;
}

export interface SmartWillBeneficiariesData {
  getSmartWillBeneficiaries: SmartWillBeneficiary[];
}

export interface BeneficiaryKeyCount {
  beneficiary_id: string;
  factor_wise_count: {
    publicKey: string;
    count: number;
  }[];
}

export interface BeneficiaryKeyCountData {
  getBeneficiaryKeyCount: BeneficiaryKeyCount[];
}

export interface SmartWillFriendsData {
  getSmartWillFriends: string[];
}

export interface Action {
  id: string;
  action: string;
  variable: string;
  condition: string;
  value: string;
  completion_key: string;
  created_at: string;
  completed_at?: string;
  ignored_at?: string;
}

export interface GetUserActionsData {
  getUserActions: Action[];
}

export interface GetIgnoredActionsData {
  getIgnoredActions: Action[];
}

export interface GetCompletedActionsData {
  getCompletedActions: Action[];
}
