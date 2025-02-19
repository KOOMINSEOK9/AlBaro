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
  async rewrites() {
    return [
      {
        source: "/ws-stomp/:path*",
        destination: "https://i12b105.p.ssafy.io/ws-stomp/:path*", // 배포 환경
      },
    ];
  },
};

// module.exports = nextConfig 대신
export default nextConfig;
