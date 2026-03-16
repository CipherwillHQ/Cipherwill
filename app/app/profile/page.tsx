import { redirect } from "next/navigation";

export default function ProfilePage() {
  redirect("/app/settings?tab=profile");
}
