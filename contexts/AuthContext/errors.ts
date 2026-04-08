import toast from "react-hot-toast";

const firebaseErrorMessages = {
  "auth/user-not-found": "User not found. Please sign up first.",
  "auth/invalid-email": "Email is invalid",
  "auth/wrong-password": "Password is invalid",
  "auth/email-already-in-use": "Email already in use",
  "auth/popup-closed-by-user": "Authentication request declined by user",
  "auth/user-cancelled": "Authentication request declined by user",
  "auth/weak-password": "Password should be at least 6 characters",
  "auth/popup-blocked": "Popup blocked by browser",
  "auth/too-many-requests": "Too many requests! Please try again in a few minutes.",
  "auth/network-request-failed":
    "Network request failed. Please try again in a few minutes.",
} as const;

export function handle_firebase_error(error) {
  const message = firebaseErrorMessages[error.code];
  if (!message) throw error;

  if (error.code === "auth/popup-blocked") {
    toast.error(message);
  }

  return { error: message };
}
