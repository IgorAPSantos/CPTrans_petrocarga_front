import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/~offline",
  },

  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.petrocarga\.com\/.*$/,
        handler: "NetworkFirst",
        options: {
          cacheName: "petrocarga-api",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60,
          },
          networkTimeoutSeconds: 5,
        },
      },
      {
        urlPattern: /^\/api\/.*$/,
        handler: "NetworkFirst",
        options: {
          cacheName: "petrocarga-api-internal",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 30,
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
