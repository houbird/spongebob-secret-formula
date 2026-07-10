import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const PAGES_BASE_PATH = "/spongebob-secret-formula";

export default function nextConfig(phase: string): NextConfig {
  const isDevelopmentServer = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    output: isDevelopmentServer ? undefined : "export",
    basePath: isDevelopmentServer ? undefined : PAGES_BASE_PATH,
    trailingSlash: true,
    ...(isDevelopmentServer
      ? {
          allowedDevOrigins: ["172.23.170.59"],
        }
      : {}),
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
