// Pod field metadata for form generation
export interface PodFieldMeta {
  key: string;
  label: string;
  type?: "text" | "email" | "textarea";
  sensitive?: boolean;
  list?: boolean;
  placeholder?: string;
  group?: string;
}
