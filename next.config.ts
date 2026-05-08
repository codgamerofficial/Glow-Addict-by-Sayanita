import type { NextConfig } from "next";

const isLocalhost = process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost');
const siteDomain = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname : 'glowaddict.com';

const getBasePath = () => {
  if (!process.env.NEXT_PUBLIC_SITE_URL) return undefined;
  const pathname = new URL(process.env.NEXT_PUBLIC_SITE_URL).pathname;
  // If pathname is '/' or empty, no basePath needed
  if (!pathname || pathname === '/') return undefined;
  return pathname;
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      // Production site domain - always HTTPS
      { protocol: 'https', hostname: siteDomain },
      // Localhost development - HTTP only
      ...(isLocalhost ? [{ protocol: 'http' as const, hostname: 'localhost', port: '3000' }] : []),
    ],
  },
  // Only set basePath if there's an actual path (subdirectory deployment)
  // For root deployment, this remains undefined
  ...(getBasePath() ? { basePath: getBasePath() } : {}),
};

export default nextConfig;
