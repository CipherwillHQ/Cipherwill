// What it does: Defines the frontend contract for a backend email send outcome.
// What it owns: Accepted and skipped results returned by password-reset requests.
// What it does NOT do: Send emails or infer eligibility from Firebase client state.

export interface EmailSendResult {
  sent: boolean;
  reason?: string | null;
}

export interface PasswordResetFormProps {
  email: string;
  onClose: () => void;
  sendPasswordResetEmail: (email: string) => Promise<EmailSendResult>;
}
