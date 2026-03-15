import { redirect } from "next/navigation";

export default function BackupPage() {
  redirect("/app/settings?tab=backup");
}
