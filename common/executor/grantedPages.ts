// Combines pages of read-only models and storage folders.
// Owns pagination merging while retaining query and cache fields.
// Does not fetch records or decide which beneficiaries can view them.

import type {
  GetGrantedMetamodelsQuery,
  GetGrantedStorageFoldersQuery,
} from "@/types/interfaces";

export function mergeGrantedModelPages(
  previous: GetGrantedMetamodelsQuery,
  { fetchMoreResult }: { fetchMoreResult?: GetGrantedMetamodelsQuery },
) {
  if (!fetchMoreResult) return previous;
  return {
    ...previous,
    getGrantedMetamodels: {
      ...previous.getGrantedMetamodels,
      ...fetchMoreResult.getGrantedMetamodels,
      models: [
        ...previous.getGrantedMetamodels.models,
        ...fetchMoreResult.getGrantedMetamodels.models,
      ],
    },
  };
}

export function mergeGrantedFolderPages(
  previous: GetGrantedStorageFoldersQuery,
  { fetchMoreResult }: { fetchMoreResult?: GetGrantedStorageFoldersQuery },
) {
  if (!fetchMoreResult) return previous;
  return {
    ...previous,
    getGrantedStorageFolders: {
      ...previous.getGrantedStorageFolders,
      ...fetchMoreResult.getGrantedStorageFolders,
      folders: [
        ...previous.getGrantedStorageFolders.folders,
        ...fetchMoreResult.getGrantedStorageFolders.folders,
      ],
    },
  };
}
