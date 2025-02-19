/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: '/ws-stomp/:path*',
        //   destination: 'http://localhost:8080/ws-stomp/:path*' // 개발 환경
          destination: 'https://i12b105.p.ssafy.io/ws-stomp/:path*' // 배포 환경
        }
      ]
    }
  }
  
  module.exports = nextConfig