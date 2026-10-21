// What it does: Converts invitation outcomes into honest user-facing feedback.
// What it owns: Sent, failed, already-sent, and skipped invitation messages.
// What it does NOT do: Send email or decide whether an invitation may be retried.

import type { InvitationEmailResult } from "@/types/interfaces";

export default function invitationFeedback(result: InvitationEmailResult): string {
  switch (result.status) {
    case "sent": return "Invitation email sent.";
    case "already_sent": return "An invitation email was already sent to this address.";
    case "failed": return result.reason || "Invitation email failed. You can retry or add the person without emailing.";
    case "skipped": return `Invitation email skipped. ${result.reason || "No email was sent."}`;
  }
}
