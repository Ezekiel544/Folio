/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pg"],
  },
  webpack: (config) => {
    // RainbowKit pulls in wagmi's connector barrel, which statically imports
    // Coinbase's optional x402 packages. We don't use those connectors, so stub
    // the optional modules instead of shipping them.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@x402": false,
    };
    return config;
  },
};

export default nextConfig;
