// Records signup conversions for accounts Firebase has just created.
// Owns the new-user check and isolates analytics failures from authentication.
// Does not identify users, initialize profiles, or change navigation.
import { getAdditionalUserInfo, type UserCredential } from "firebase/auth";
import type { PostHog } from "posthog-js";
import logger from "../debug/logger";

export default async function trackSignupConversion(
  credential: UserCredential,
  posthog: Pick<PostHog, "capture">
) {
  if (!getAdditionalUserInfo(credential)?.isNewUser) return;

  try {
    posthog.capture("signup");
  } catch (error) {
    logger.error("Unable to record signup in PostHog", error);
  }

  try {
    const conversion = (window as Window & {
      GoogleConverted?: () => void | Promise<void>;
    }).GoogleConverted;
    if (conversion) {
      await conversion();
    } else {
      logger.error("GoogleConverted is not defined");
    }
  } catch (error) {
    logger.error("Unable to record Google signup conversion", error);
  }
}
