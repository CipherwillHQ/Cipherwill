// Handles GraphQL feedback and redirects requests that require email verification.
// Owns the shared error response for pending invitations and executor access.
// Does not change authentication or grant permissions.
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import logger from "../../common/debug/logger";
import toast from "react-hot-toast";

const ErrorsToHide = [
  "USER_NOT_FOUND",
  "MODEL_NOT_FOUND",
  "POD_NOT_FOUND",
  "EMAIL_NOT_VERIFIED",
  "COUNTRY_RESTRICTED_ACCORDING_TO_SUBSCRIPTION",
  "USER_DEACTIVATED",
  "BIRTH_DATE_IN_FUTURE"
] as string[]; // handled by application

const errHandler = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    if (typeof window !== "undefined" && window.location.pathname !== "/auth/verify-email"
      && error.errors.some(item => item.extensions?.code === "EMAIL_NOT_VERIFIED")) {
      window.location.replace("/auth/verify-email?redirect=" + encodeURIComponent(window.location.pathname));
    }
    if (error.errors.length > 0) {
      error.errors.forEach((gqlError) => {
        if (
          ErrorsToHide.includes(
            gqlError.extensions?.code
              ? (gqlError.extensions.code as string)
              : "NA"
          )
        ) {
          logger.info("Error handled by application", gqlError);
          // do nothing if error is handled by application
          // toast.error(gqlError.message);
        } else {
          toast.error(gqlError.message);
        }
      });
    }
  }
});
export default errHandler;
