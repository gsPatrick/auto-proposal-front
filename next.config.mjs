/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Desativa o lint durante o build para agilizar o deploy em Easypanel se necessário
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
