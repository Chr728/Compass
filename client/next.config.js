// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   transpilePackages: ["gsap"],
// };

// module.exports = nextConfig;

const withPWA = require("@ducanh2912/next-pwa").default({
  swcMinify: true,      //rust compiler
  dest: "public",
  register: true,
  workboxOptions: {
    swSrc: "service-worker.js",
  },
  cacheStartUrl: true,
});

module.exports = withPWA({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  }
});
