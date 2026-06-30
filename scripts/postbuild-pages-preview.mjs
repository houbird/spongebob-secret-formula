import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const DEFAULT_BASE_PATH = "/spongebob-secret-formula";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? DEFAULT_BASE_PATH;
const normalizedBasePath = basePath.replace(/^\/+|\/+$/g, "");

if (!normalizedBasePath) {
  process.exit(0);
}

const outDir = resolve(process.cwd(), "out");

if (!existsSync(outDir)) {
  throw new Error("Expected out directory to exist after next build.");
}

const nestedPreviewDir = join(outDir, normalizedBasePath);

rmSync(nestedPreviewDir, { recursive: true, force: true });
mkdirSync(nestedPreviewDir, { recursive: true });

for (const entry of readdirSync(outDir)) {
  if (entry === normalizedBasePath) {
    continue;
  }

  cpSync(join(outDir, entry), join(nestedPreviewDir, entry), {
    recursive: true,
  });
}