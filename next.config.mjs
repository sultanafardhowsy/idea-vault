/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ← This allows images from ANY secure website
      },
      {
        protocol: 'http',
        hostname: '**', // ← This allows older unsecure URLs (optional, but helpful for mixed database URLs)
      },
    ],
  },
};

export default nextConfig;