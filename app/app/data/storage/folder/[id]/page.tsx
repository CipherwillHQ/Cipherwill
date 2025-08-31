"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import AddFile from "@/components/app/data/storage/AddFile";
import AddFolder from "@/components/app/data/storage/AddFolder";
import DeleteFolder from "@/components/app/data/storage/DeleteFolder";
import FileList from "@/components/app/data/storage/FileList";
import FoldersList from "@/components/app/data/storage/FoldersList";
import GET_FOLDER from "@/graphql/ops/app/storage/queries/GET_FOLDER";
import { useQuery } from "@apollo/client/react";
import { GetFolderQuery, GetFolderVariables } from "@/types/interfaces";
import { useParams } from "next/navigation";

export default function StorageFolderPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, loading, error, fetchMore } = useQuery<GetFolderQuery, GetFolderVariables>(GET_FOLDER, {
    variables: {
      id,
    },
  });

  // Handle folder not found error
  if (error && 'errors' in error && error.errors && error.errors[0]) {
    const error_code = error.errors[0].extensions?.code;
    if (error_code === "FOLDER_NOT_FOUND") {
      window.location.href = "/app/data/storage";
    }
  }

  if (loading) return null;
  if (error) return <div>{JSON.stringify(error)}</div>;
  if (!data) return <div>No data found</div>;

  const folder_details = data.getFolder;
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader
        title={`Folder: ${folder_details.name}`}
        backPath={
          folder_details.folder_id === "root"
            ? "/app/data/storage"
            : `/app/data/storage/folder/${folder_details.folder_id}`
        }
      >
        <div className="flex gap-2">
          <DeleteFolder id={id} folder_id={folder_details.folder_id} />
          <AddFolder folder_id={id} />
          <AddFile folder_id={id} />
        </div>
      </DesktopAndMobilePageHeader>
      <FoldersList folder_id={id} />
      <FileList folder_id={id} />
    </div>
  );
}
