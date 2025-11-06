/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true }, // set to false once stable
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
