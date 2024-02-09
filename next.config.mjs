/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    mdxRss: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
};

export default nextConfig;
