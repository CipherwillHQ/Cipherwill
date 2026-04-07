import {
  BackupItem,
  BackupVersion,
  MetamodelAdapter,
  RestoreAdapter,
} from "./types";

const defaultMetadata = (item: BackupItem) =>
  item.metadata ||
  JSON.stringify({
    title: item.title,
  });

const isDataEmpty = (data: unknown) =>
  data === "" ||
  data === null ||
  data === undefined ||
  (typeof data === "object" &&
    data !== null &&
    "data" in data &&
    (data as { data?: unknown }).data === "");

const genericRestoreAdapters: Record<BackupVersion, RestoreAdapter> = {
  "0.0.1": {
    version: "0.0.1",
    getUploadData: (item) => JSON.stringify(item.data),
    getDataModelVersion: (item) => item.data?.version || "0.0.1",
    shouldUploadData: (item) => !isDataEmpty(item.data),
  },
  "0.0.2": {
    version: "0.0.2",
    getUploadData: (item) => JSON.stringify(item.data),
    getDataModelVersion: (item) => item.data?.version || "0.0.2",
    shouldUploadData: (item) => !isDataEmpty(item.data),
  },
};

const metamodelAdapters: Record<BackupVersion, MetamodelAdapter> = {
  "0.0.1": {
    version: "0.0.1",
    getMetadata: (item) =>
      JSON.stringify({
        title: item.title,
      }),
  },
  "0.0.2": {
    version: "0.0.2",
    getMetadata: (item) => defaultMetadata(item),
  },
};

const legacyNoteRestoreAdapter001: RestoreAdapter = {
  version: "0.0.1",
  getUploadData: (item) =>
    JSON.stringify({
      type: "note",
      data: item.data,
    }),
  getDataModelVersion: () => "0.0.1",
  shouldUploadData: (item) => !isDataEmpty(item.data),
};

const noteRestoreAdapters: Record<BackupVersion, RestoreAdapter> = {
  "0.0.1": {
    ...genericRestoreAdapters["0.0.1"],
    getUploadData: (item) =>
      JSON.stringify({
        type: "note",
        data: item.data,
      }),
  },
  "0.0.2": {
    ...genericRestoreAdapters["0.0.2"],
  },
};

export function resolveRestoreAdapter({
  item,
}: {
  item: BackupItem;
}): RestoreAdapter {
  const metamodelType = String(item.type || "").toUpperCase();
  const dataType = String(item.data?.type || "").toLowerCase();
  const itemVersion = item.data?.version as BackupVersion | undefined;
  const adapterVersion: BackupVersion =
    itemVersion === "0.0.1" || itemVersion === "0.0.2"
      ? itemVersion
      : "0.0.1";

  if (
    metamodelType === "NOTE" &&
    (dataType === "note" || (adapterVersion === "0.0.1" && !dataType))
  ) {
    if (adapterVersion === "0.0.1" && !dataType) {
      return legacyNoteRestoreAdapter001;
    }
    return noteRestoreAdapters[adapterVersion];
  }

  return genericRestoreAdapters[adapterVersion];
}

export function resolveMetamodelAdapter({
  backupVersion,
}: {
  backupVersion: BackupVersion;
}): MetamodelAdapter {
  return metamodelAdapters[backupVersion];
}
