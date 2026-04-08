import toast from "react-hot-toast";

export function handle_firebase_error(error) {
  if (error.code === "auth/user-not-found") {
    return {
      error: "User not found. Please sign up first.",
    };
  } else if (error.code === "auth/invalid-email") {
    return {
      error: "Email is invalid",
    };
  } else if (error.code === "auth/wrong-password") {
    return {
      error: "Password is invalid",
    };
  } else if (error.code === "auth/email-already-in-use") {
    return {
      error: "Email already in use",
    };
  } else if (error.code === "auth/popup-closed-by-user") {
    return {
      error: "Authentication request declined by user",
    };
  } else if (error.code === "auth/user-cancelled") {
    return {
      error: "Authentication request declined by user",
    };
  } else if (error.code === "auth/weak-password") {
    return {
      error: "Password should be at least 6 characters",
    };
  } else if (error.code === "auth/popup-blocked") {
    toast.error("Popup blocked by browser");
    return {
      error: "Popup blocked by browser",
    };
  } else if (error.code === "auth/too-many-requests") {
    return {
      error: "Too many requests! Please try again in a few minutes.",
    };
  } else if (error.code === "auth/network-request-failed") {
    return {
      error: "Network request failed. Please try again in a few minutes.",
    };
  } else {
    throw error;
  }
}

