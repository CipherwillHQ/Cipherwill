import { POD_TYPE } from "@/types/POD";

export type PodHookConfig<POD_DATA_TYPE> = {
  TYPE: POD_TYPE;
  VERSION: string;
  REF_ID: string;
  DATA_SAMPLE: POD_DATA_TYPE;
};

export type PodHookOptions<POD_DATA_TYPE> = {
  onComplete?: (data: null | POD_DATA_TYPE) => void;
  lazy?: boolean;
};

export type ParsedPodContent<POD_DATA_TYPE> = {
  type: string;
  version: string;
  data: POD_DATA_TYPE;
};
