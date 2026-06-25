import { fileURLToPath } from "url";
import { dirname } from "path";

const here = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project (an unrelated lockfile sits in the home dir).
  outputFileTracingRoot: here,
};

export default nextConfig;
