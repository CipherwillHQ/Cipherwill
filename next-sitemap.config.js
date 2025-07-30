/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.cipherwill.com",
  generateRobotsTxt: true,
  additionalPaths: async (config) => [
    await config.transform(config, "/"),
  ],
  exclude: [
    "/manifest.webmanifest",
    "/i",
    "/auth/*",
    "/executor",
    "/blogs-sitemap.xml",
    "/executor/*",
    "/app",
    "/app/*",
    "/callback",
    "/callback/*",
    "/i/frequently-asked-questions/sitemap.xml",
    "/i/payment-integration-test",
    "/i/legacy",
    "/i/assets",
    "/i/security",
    "/i/grief",
    "/i/legal",
    "/i/personas/sitemap.xml",
    "/careers/sitemap.xml",
  ], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://www.cipherwill.com/blogs-sitemap.xml",
      "https://www.cipherwill.com/i/frequently-asked-questions/sitemap.xml",
      "https://www.cipherwill.com/i/personas/sitemap.xml",
      "https://www.cipherwill.com/careers/sitemap.xml",
    ],
  },
};
