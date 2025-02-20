/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "albaro.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
  reactStrictMode: true,
  // 웹소켓 요청을 Next.js가 처리하지 않도록 설정
  async headers() {
    return [
      {
        source: "/ws/:path*",
        headers: [
          { key: "Connection", value: "upgrade" },
          { key: "Upgrade", value: "websocket" }
        ],
      },
    ];
  },
};

export default nextConfig;