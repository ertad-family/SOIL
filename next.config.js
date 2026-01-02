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

  // External packages for server-side (native Node.js dependencies)
  serverExternalPackages: ["draco3dgltf", "sharp"],

  // Webpack config for WASM support
  webpack: (config, { isServer }) => {
    // Enable WASM support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // For server-side, handle WASM files
    if (isServer) {
      config.output.webassemblyModuleFilename = "chunks/[id].wasm";
    }

    return config;
  },
};

module.exports = nextConfig;
