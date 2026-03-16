import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

const client_uploadLink = (getJWT: Function) =>
  new UploadHttpLink({
    uri: process.env.NEXT_PUBLIC_API_HOST,
    fetch: async (uri, options) => {
      const jwt = await getJWT();
      if (jwt) {
        options.headers["Authorization"] = jwt;
      }
      return await fetch(uri, options);
    },
  });

const SSR_API_AUTH_TOKEN = process.env.SSR_API_AUTH_TOKEN;

const ssr_uploadLink = (cache: any = "no-store") =>
  new UploadHttpLink({
    uri: process.env.NEXT_PUBLIC_API_HOST,
    fetch: async (uri, options) => {
      if (typeof cache === "number" && process.env.NEXT_PUBLIC_BUILD_ENV === "production") {
        options["next"] = {
          revalidate: cache,
        };
      } else {
        options["cache"] = "no-store";
      }

      if (!SSR_API_AUTH_TOKEN) {
        throw new Error(
          "Missing SSR_API_AUTH_TOKEN for secure SSR GraphQL authorization"
        );
      }

      options.headers = {
        ...(options.headers || {}),
        Authorization: SSR_API_AUTH_TOKEN,
      };
      return await fetch(uri, options);
    },
  });
export { client_uploadLink, ssr_uploadLink };
