import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the libsql native bindings out of the serverless bundle.
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
