/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better error detection
  reactStrictMode: true,

  // Configure remote image patterns for Next.js Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;
