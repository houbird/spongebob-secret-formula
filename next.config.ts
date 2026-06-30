import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const PAGES_BASE_PATH = "/spongebob-secret-formula";
const QUOTES_ENDPOINT =
  "https://opensheet.elk.sh/1P7h4--lgGrIEsLNz-qyVJUJ7V6yPgZUaFU-wwfqwH7M/wumbo";

export default function nextConfig(phase: string): NextConfig {
  const isDevelopmentServer = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    output: isDevelopmentServer ? undefined : "export",
    basePath: isDevelopmentServer ? undefined : PAGES_BASE_PATH,
    trailingSlash: true,
    ...(isDevelopmentServer
      ? {
          allowedDevOrigins: ["172.23.170.59"],
          async rewrites() {
            return [
              {
                source: "/api/quotes/",
                destination: QUOTES_ENDPOINT,
              },
            ];
          },
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
