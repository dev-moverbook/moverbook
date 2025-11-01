// next.config.js
const withPWA = require("next-pwa");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const pwaOptions = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
};

module.exports = withPWA(pwaOptions)(nextConfig);
