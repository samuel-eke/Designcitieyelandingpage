import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow SVG and CSV as static assets
  async rewrites() {
    const serverUrl = process.env.SERVER_URL || "http://localhost:8080";
    return [
      {
        source: "/api/:path*",
        destination: `${serverUrl.trim().replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
