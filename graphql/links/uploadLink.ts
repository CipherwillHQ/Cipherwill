import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const client_uploadLink = (getJWT: Function) =>
  createUploadLink({
    uri: process.env.NEXT_PUBLIC_API_HOST,
    fetch: async (uri, options) => {
      const jwt = await getJWT();
      if (jwt) {
        options.headers["Authorization"] = jwt;
      }
      return await fetch(uri, options);
    },
  });

const ssr_uploadLink = (cache: any = "no-store") =>
  createUploadLink({
    uri: process.env.NEXT_PUBLIC_API_HOST,
    fetch: async (uri, options) => {
      if (typeof cache === "number" && process.env.NEXT_PUBLIC_BUILD_ENV === "production") {
        options["next"] = {
          revalidate: cache,
        };
      } else {
        options["cache"] = "no-store";
      }
      options.headers["Authorization"] = "ratrio-srr-server";
      return await fetch(uri, options);
    },
  });
export { client_uploadLink, ssr_uploadLink };