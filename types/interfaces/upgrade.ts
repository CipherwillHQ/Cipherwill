// Defines the public upgrade page and checkout component inputs.
// Owns mobile link inputs and the WebView checkout result contract.
// Does not authenticate an account or grant Premium access.

export interface UpgradePageProps {
  searchParams: Promise<{
    email?: string | string[];
    user_id?: string | string[];
  }>;
}

export interface UpgradeScreenProps {
  email: string;
  userId: string;
}

export interface SubscriptionUpgradeProps {
  onUpgrade: () => void;
}

export interface UpgradeWebViewMessage {
  type: "cipherwill.upgrade";
  status: "success" | "error";
  code?: string;
  message?: string;
}

export interface UpgradeWebViewWindow extends Window {
  CipherwillUpgrade?: { postMessage: (message: string) => void };
}
