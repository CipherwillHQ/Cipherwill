export type POSSIBLE_STATUS =
  | "Not started"
  | "Calculating data points"
  | "Downloading encrypted data"
  | "Downloading metadata"
  | "Mapping metadata to pods"
  | "Creating a zip file"
  | "Completed backup"
  | "Error while backing up";
