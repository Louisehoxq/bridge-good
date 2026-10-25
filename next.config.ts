import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // v1 routes moved when the site became role-based.
  async redirects() {
    return [
      { source: "/students", destination: "/student", permanent: false },
      { source: "/ambassadors", destination: "/ambassador", permanent: false },
      { source: "/problem-owners", destination: "/partner", permanent: false },
    ]
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
