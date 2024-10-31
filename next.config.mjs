/** @type {import('next').NextConfig} */
// import { fileURLToPath } from "node:url";

// Needed for t3-env
// import createJiti from "jiti";

// const jiti = createJiti(fileURLToPath(import.meta.url));
// jiti("./env.ts");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
