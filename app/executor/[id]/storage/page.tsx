import { redirect } from "next/navigation";


export default async function StorageRedirect({
  params
}){
  const { id } = await params;
  return redirect(`/executor/${id}/storage/folder/root`);
}