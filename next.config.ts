/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "a.slack-edge.com",
      "avatars.slack-edge.com",
      "cdn.jsdelivr.net",
      "secure.gravatar.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
