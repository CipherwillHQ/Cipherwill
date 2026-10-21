// Renders the shared files and folders at the current storage location.
// Owns integration of folder navigation and the read-only files list.
// Does not download, decrypt, or modify files.

"use client";

import { useParams } from "next/navigation";
import GrantedDataList from "@/components/executor/GrantedDataList";
import GrantedFolderList from "./GrantedFolderList";

export default function GrantedFolderView() {
  const { id, folder_id } = useParams<{ id: string; folder_id: string }>();

  return (
    <GrantedDataList slug="storage" folderId={folder_id}>
      <GrantedFolderList access_id={id} folder_id={folder_id} />
    </GrantedDataList>
  );
}
