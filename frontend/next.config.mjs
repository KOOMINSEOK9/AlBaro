/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: '/ws-stomp/:path*',
          destination: 'https://i12b105.p.ssafy.io/ws-stomp/:path*' // 배포 환경
        }
      ]
    }
}

// module.exports = nextConfig 대신
export default nextConfig;