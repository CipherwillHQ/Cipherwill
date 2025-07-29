import { onError } from "@apollo/client/link/error";
import logger from "../../common/debug/logger";
import toast from "react-hot-toast";

const ErrorsToHide = [
  "USER_NOT_FOUND",
  "MODEL_NOT_FOUND",
  "POD_NOT_FOUND",
  "EMAIL_NOT_VERIFIED",
  "COUNTRY_RESTRICTED_ACCORDING_TO_SUBSCRIPTION",
] as string[]; // handled by application

const errHandler = onError((err) => {
  if (err.graphQLErrors !== null && err.graphQLErrors !== undefined) {
    if (err.graphQLErrors.length > 0) {
      err.graphQLErrors.forEach((gqlError) => {
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
