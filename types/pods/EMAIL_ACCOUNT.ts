// 0.0.1
export type EMAIL_ACCOUNT_TYPE = {
  email?: string;
  password?: string;
  provider?: string;             // e.g., Gmail, Outlook, Yahoo
  recoveryEmail?: string;         // A recovery email address
  recoveryPhone?: string;         // A recovery phone number
  securityQuestion?: string;      // Security question for account recovery
  securityAnswer?: string;        // Answer to the security question
  backupCodes?: string[];         // Array of backup codes for 2FA
  aliasEmails?: string[];         // List of alias email addresses
  note?: string;
};
