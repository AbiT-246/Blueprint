import path from "node:path";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

// Load repo-root .env so BACKEND_URL / API_KEY are available to the proxy.
loadEnvConfig(path.resolve(__dirname, ".."));

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
