const { withSentryConfig } = require("@sentry/nextjs");
const { version } = require("./package.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none';",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=()", // Or relevant to your app
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  publicRuntimeConfig: {
    version: `v${version}`,
  },
  webpack: (config, { isServer }) => {
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };
    return config;
  },
  experimental: {
    instrumentationHooks: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.cipherwill.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
    ],
  },
};

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    // org: "cipherwill",
    // project: "cipherwill-x-webapp",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
