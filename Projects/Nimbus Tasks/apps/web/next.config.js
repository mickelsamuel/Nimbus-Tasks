/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@nimbus/ui", "@nimbus/db"],
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com", "lh3.googleusercontent.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;