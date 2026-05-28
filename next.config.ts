import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
  },
  async headers() {
    return [
      {
        source: "/data/:path*",
        headers: [{ key: "x-robots-tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
