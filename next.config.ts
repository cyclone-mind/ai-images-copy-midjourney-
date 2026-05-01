import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hailuo-image-algeng-data.oss-cn-wulanchabu.aliyuncs.com",
      },
      {
        protocol: "https",
        hostname: "**.aliyuncs.com",
      },
    ],
  },
};

export default nextConfig;
