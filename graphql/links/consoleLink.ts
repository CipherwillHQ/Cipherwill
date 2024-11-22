import { ApolloLink } from "@apollo/client";
import logger from "../../common/debug/logger";

const consoleLink = new ApolloLink((operation, forward) => {
  logger.info(`GraphQL ---> ${operation.operationName}`);

  var EnableSubOpLevelLogging = false;
  if (
    EnableSubOpLevelLogging &&
    operation.operationName !== "IntrospectionQuery"
  ) {
    operation.query.definitions.forEach((entry: any) => {
      entry.selectionSet["selections"].forEach((op: any) => {
        logger.info("OP - ", op["name"]["value"]);
      });
    });
  }
  return forward(operation);
});
export default consoleLink;