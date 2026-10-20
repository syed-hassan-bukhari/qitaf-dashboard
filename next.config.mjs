/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets a test/CI build run in its own folder without clobbering a running `next dev` (which uses .next).
  distDir: process.env.NEXT_DIST_DIR || ".next",
};
export default nextConfig;
