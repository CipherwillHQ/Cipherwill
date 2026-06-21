// 0.0.1
import { PodFieldMeta } from "@/types/interfaces";

export type PAYMENT_CARD_TYPE = {
  type?: string;
  card_holder_name?: string;
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
  issuer?: string;
  network?: string;
  note?: string;
};

export const PAYMENT_CARD_MANDATORY: PodFieldMeta[] = [
  { key: "card_holder_name", label: "Card Holder Name" },
  { key: "card_number", label: "Card Number" },
  { key: "expiry_date", label: "Expiry Date", placeholder: "e.g., 12/2025" },
];

export const PAYMENT_CARD_OPTIONAL: PodFieldMeta[] = [
  { key: "type", label: "Type", placeholder: "e.g., Credit, Debit" },
  { key: "cvv", label: "CVV", placeholder: "e.g., 123" },
  { key: "issuer", label: "Issuer", placeholder: "e.g., AB Bank" },
  { key: "network", label: "Network", placeholder: "e.g., Visa, Mastercard" },
  { key: "note", label: "Note", type: "textarea" },
];
