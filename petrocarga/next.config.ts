import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",

  runtimeCaching: [
    // APIs externas
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

    // 🔹 APIs internas (/api do Next)
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
})(nextConfig);
