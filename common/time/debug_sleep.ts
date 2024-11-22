import logger from "../debug/logger";

export function debug_sleep(ms: number) {
  if (process.env.NEXT_PUBLIC_BUILD_ENV !== "production") {
    logger.info(`DEBUG SLEEP`, ms / 1000, " Seconds");
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  return null;
}
