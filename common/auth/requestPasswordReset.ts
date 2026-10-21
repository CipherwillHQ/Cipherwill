// What it does: Requests a verification-aware password reset from the backend.
// What it owns: The public GraphQL request and accurate email send results.
// What it does NOT do: Use Firebase's client email sender or expose reset links.

import type { EmailSendResult } from "@/types/interfaces";

export default async function requestPasswordReset(email: string): Promise<EmailSendResult> {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_HOST!, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationName: "REQUEST_PASSWORD_RESET",
        query: "mutation REQUEST_PASSWORD_RESET($email: String!) { requestPasswordReset(email: $email) { sent reason } }",
        variables: { email: email.trim() },
      }),
    });
    if (!response.ok) return { sent: false, reason: "Password reset request failed. Please try again" };
    const result = await response.json();
    if (result.errors?.length) return { sent: false, reason: result.errors[0].message };
    return result.data?.requestPasswordReset ?? { sent: false, reason: "Password reset request failed. Please try again" };
  } catch {
    return { sent: false, reason: "Password reset request failed. Please try again" };
  }
}
