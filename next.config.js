/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: [
      "content.rozetka.com.ua",
      "content1.rozetka.com.ua",
      "content2.rozetka.com.ua",
      "content3.rozetka.com.ua",
      "content4.rozetka.com.ua",
      "content5.rozetka.com.ua",
      "content6.rozetka.com.ua",
      "content7.rozetka.com.ua",
      "content8.rozetka.com.ua",
      "content9.rozetka.com.ua",
      "content10.rozetka.com.ua",
      "content11.rozetka.com.ua",
    ],
  },
};

module.exports = nextConfig;
