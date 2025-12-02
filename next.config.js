/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    remotePatterns: [],
  },
  // Configuración de ESLint - los warnings no bloquean el build
  eslint: {
    // No ignorar completamente, pero los warnings no bloquean
    ignoreDuringBuilds: false,
  },
  webpack: (config, { isServer }) => {
    // Resolver problemas con next-auth
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;


