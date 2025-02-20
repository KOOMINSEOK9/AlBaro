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
        source: "/ws/:path*",
        // destination: "http://localhost:8080/ws/:path*", // 개발 환경
        destination: "http://backend:8080/ws/:path*", // 배포 환경 - Docker 내부 네트워크 사용
      },
    ];
  },
};

export default nextConfig;