import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
