// Sets response protections for upgrade links containing account details.
// Owns search exclusion, referrer suppression, and browser/CDN cache prevention.
// Does not block unauthenticated requests or configure other public routes.
module.exports = {
  source: "/upgrade",
  headers: [
    { key: "X-Robots-Tag", value: "noindex, nofollow" },
    { key: "Referrer-Policy", value: "no-referrer" },
    { key: "Cache-Control", value: "private, no-store" },
    { key: "CDN-Cache-Control", value: "no-store" },
    { key: "Vercel-CDN-Cache-Control", value: "no-store" },
  ],
};
