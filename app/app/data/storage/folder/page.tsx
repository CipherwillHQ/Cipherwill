import { RedirectType, redirect } from "next/navigation";

export default function Redirect() {
  return redirect("/app/data/storage", RedirectType.replace);
}
