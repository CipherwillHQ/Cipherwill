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
