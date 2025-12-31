const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@athlete-system/rules', '@athlete-system/database', '@athlete-system/shared'],
  images: {
    domains: ['localhost'],
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:4000',
  },
  webpack: (config, { isServer }) => {
    // Add alias for workspace packages
    config.resolve.alias = {
      ...config.resolve.alias,
      '@athlete-system/shared': path.resolve(__dirname, '../shared/src'),
      '@athlete-system/rules': path.resolve(__dirname, '../rules/src'),
    };
    return config;
  },
};

module.exports = nextConfig;
