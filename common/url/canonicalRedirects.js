// Redirects apex cipherwill.com requests permanently to www.cipherwill.com.
// Owns host-level canonicalization while keeping /.well-known verification files direct.
// Does not modify subdomains or enforce HTTPS at the reverse proxy.
const APEX_HOST = [{ type: "host", value: "cipherwill.com" }];

module.exports = [
  {
    source: "/",
    has: APEX_HOST,
    destination: "https://www.cipherwill.com/",
    permanent: true,
  },
  {
    source: "/:path((?!\\.well-known(?:/|$)).+)",
    has: APEX_HOST,
    destination: "https://www.cipherwill.com/:path",
    permanent: true,
  },
];
