/** @type {import('next').NextConfig} */
const nextConfig = {
  // REMOVIDO: eslint
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
