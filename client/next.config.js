// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   transpilePackages: ["gsap"],
// };

// module.exports = nextConfig;

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting:true,
  swSrc: "service-worker.js",
  cacheStartUrl: true,
});

module.exports = withPWA({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  }
});
