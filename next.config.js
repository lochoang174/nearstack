/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    esmExternals: 'loose',  // Or set to 'true' for strict mode

  },
  reactStrictMode: false,  // (Tùy chọn) giữ strict mode cho React
  output: 'standalone',
  staticPageGenerationTimeout: 0,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Provide mock for indexedDB during server-side rendering
      config.resolve.fallback = {
        ...config.resolve.fallback,
        indexedDB: false,
      };
    }
    return config;
  },
  images: {
    domains: ['dvxchmddbtezvuifpjol.supabase.co'], // Add the hostname causing the error to the domains array
  },
};

module.exports = nextConfig;
