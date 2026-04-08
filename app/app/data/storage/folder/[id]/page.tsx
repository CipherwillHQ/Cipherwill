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
import type { GraphQLErrorLike } from "@/types/interfaces/graphql";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StorageFolderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data, loading, error, fetchMore } = useQuery<GetFolderQuery, GetFolderVariables>(GET_FOLDER, {
    variables: {
      id,
    },
  });

  // Handle folder not found error
  const error_code = (error as GraphQLErrorLike)?.errors?.[0]?.extensions?.code;
  useEffect(() => {
    if (error_code === "FOLDER_NOT_FOUND") {
      router.replace("/app/data/storage");
    }
  }, [error_code, router]);
  if (error_code === "FOLDER_NOT_FOUND") return null;

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
