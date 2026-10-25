// Defines the two-slide email verification presentation contract.
// Owns delivery/check states and callbacks used by guide components.
// Does not contain verification links, tokens, or authentication state.
export interface EmailVerificationProps {
  sent: boolean;
  busy: boolean;
  error: string | null;
  onSend: () => Promise<void>;
  onCheck: () => Promise<void>;
  onClose: () => void;
}
