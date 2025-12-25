/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'grahasthee.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
