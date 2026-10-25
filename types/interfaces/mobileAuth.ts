// Defines the native authentication bridge and short-lived Firebase payload.
// Owns the WebView request/response contract.
// Does not store credentials or authenticate accounts.
export interface MobileFirebaseSession {
  uid: string;
  idToken: string;
}

export interface MobileAuthWindow extends Window {
  CipherwillAuth?: { postMessage(message: string): void };
  CipherwillAuthResponse?: (id: number, session: MobileFirebaseSession | null) => void;
}