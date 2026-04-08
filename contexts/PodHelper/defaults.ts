import { PodHookOptions } from "./types";

export function getPodHookOptions<POD_DATA_TYPE>(
  options?: PodHookOptions<POD_DATA_TYPE>
) {
  const defaultOptions: Required<PodHookOptions<POD_DATA_TYPE>> = {
    onComplete: (_data) => {},
    lazy: false,
  };

  return {
    ...defaultOptions,
    ...options,
  };
}
