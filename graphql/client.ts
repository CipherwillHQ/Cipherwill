import {
    ApolloClient,
    from,
    InMemoryCache,
  } from "@apollo/client";
  import consoleLink from "./links/consoleLink";
  import errHandler from "./links/errHandler";
  import { client_uploadLink } from "./links/uploadLink";
  
  function getGraphQLClient(
    getJWT: Function
  ): ApolloClient {
    return new ApolloClient({
      link: from(
        process.env.NEXT_PUBLIC_BUILD_ENV === "production"
          ? [errHandler, client_uploadLink(getJWT)]
          : [consoleLink, errHandler, client_uploadLink(getJWT)]
      ),
      cache: new InMemoryCache(),
    });
  }
  
  export { getGraphQLClient };