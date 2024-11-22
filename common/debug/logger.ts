import log from "loglevel";
import { BUILD_ENV, IS_PRODUCTION } from "../constant";

const logger = log.getLogger("default");
logger.setLevel(IS_PRODUCTION ? "WARN" : "TRACE");
export default logger;