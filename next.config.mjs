/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_DRCHRONO_CLIENT_ID: process.env.DRCHRONO_CLIENT_ID,
    NEXT_PUBLIC_DRCHRONO_REDIRECT_URI: process.env.DRCHRONO_REDIRECT_URI,
  },
  // Add this to configure path aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };
    return config;
  },
}

export default nextConfig