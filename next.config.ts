import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow SVG and CSV as static assets
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
