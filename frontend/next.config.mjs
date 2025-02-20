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
  
  // WebSocket 요청을 백엔드로 리다이렉트
  async rewrites() {
    return [
      {
        source: '/ws/:path*',
        destination: 'http://backend:8080/ws/:path*', // Docker 내부 네트워크 주소
      }
    ];
  },

  // WebSocket 헤더 설정
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