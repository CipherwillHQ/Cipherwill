// Delays development-only work while honoring optional cancellation.
// Owns timer cleanup and production bypass for shared debug waits.
// Does not schedule background tasks or execute guidance.
import logger from "../debug/logger";

export function debug_sleep(ms: number, signal?: AbortSignal) {
  signal?.throwIfAborted();
  if (process.env.NEXT_PUBLIC_BUILD_ENV !== "production") {
    logger.info(`DEBUG SLEEP`, ms / 1000, " Seconds");
    return new Promise<void>((resolve, reject) => {
      const abort = () => { clearTimeout(timer); reject(signal?.reason); };
      const timer = setTimeout(() => { signal?.removeEventListener("abort", abort); resolve(); }, ms);
      signal?.addEventListener("abort", abort, { once: true });
    });
  }
  return null;
}
