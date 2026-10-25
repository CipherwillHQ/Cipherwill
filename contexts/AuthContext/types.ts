// Defines the login snapshot used by frontend route guards.
// Includes email verification for executor entry checks.
// Does not represent the backend application identity.
export type AuthUser =
  | {
      uid: string;
      email: string;
      emailVerified: boolean;
    }
  | null
  | undefined;

