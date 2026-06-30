import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const PAGES_BASE_PATH = "/spongebob-secret-formula";

export default function nextConfig(phase: string): NextConfig {
  const isDevelopmentServer = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    output: "export",
    basePath: isDevelopmentServer ? undefined : PAGES_BASE_PATH,
    trailingSlash: true,
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "i.imgur.com",
        },
      ],
    },
  };
}
