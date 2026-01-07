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
      {
        protocol: 'https',
        hostname: 'mjfhiejalujscbchshok.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
