import { redirect } from "next/navigation";

export default async function GrantedFolderView({ params }) {
  const { id } = await params;

  return redirect(`/executor/${id}/storage`);
}
