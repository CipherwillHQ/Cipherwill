// Serves a public upgrade screen for links opened from the mobile client.
// Owns query parameter parsing and search-engine exclusion metadata.
// Does not require a session or grant Premium before payment processing.
import type { Metadata } from "next";
import getSingleSearchParam from "@/common/url/getSingleSearchParam";
import type { UpgradePageProps } from "@/types/interfaces";
import UpgradeScreen from "./UpgradeScreen";

export const metadata: Metadata = {
  title: "Upgrade to Premium - Cipherwill",
  description: "Upgrade your Cipherwill account to Premium.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
  alternates: { canonical: "/upgrade" },
};

export default async function UpgradePage({ searchParams }: UpgradePageProps) {
  const params = await searchParams;
  const email = getSingleSearchParam(params.email)?.trim() ?? "";
  const userId = getSingleSearchParam(params.user_id)?.trim() ?? "";

  return <UpgradeScreen email={email} userId={userId} />;
}
