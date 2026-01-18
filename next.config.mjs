/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: [],
  },
  
  // Note: NEXT_PUBLIC_* variables are automatically exposed to the browser
  // No need to manually add them to env object
  // Just ensure NEXT_PUBLIC_API_URL is set in Vercel environment variables
};

export default nextConfig;
