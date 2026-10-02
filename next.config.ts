import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the development indicator clear of the sidebar's collapse control.
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
