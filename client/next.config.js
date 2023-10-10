// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   transpilePackages: ["gsap"],
// };

// module.exports = nextConfig;

const withPWA = require("next-pwa")({
  dest: "public",
  swSrc: "service-worker.js",
});

module.exports = withPWA({
  transpilePackages: ["gsap"],
  reactStrictMode: true,
});
