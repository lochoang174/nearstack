/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    esmExternals: 'loose',  // Or set to 'true' for strict mode

  },
  reactStrictMode: false,  // (Tùy chọn) giữ strict mode cho React

  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "next/router": "next-router-mock",
    };
    return config;
  },
  images: {
    domains: ['dvxchmddbtezvuifpjol.supabase.co'], // Add the hostname causing the error to the domains array
  },
};

module.exports = nextConfig;
