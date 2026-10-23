// Opens the account overview and guided setup inside the shared app layout.
// Owns the /app/guide route and its page title.
// Does not load account data or run guidance on the server.
import type { Metadata } from "next";
import GuidedActions from "@/components/app/GuidedActions";

export const metadata: Metadata = { title: "Cipherwill Setup" };

export default function GuidePage() {
  return <GuidedActions />;
}
