/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['albaro.s3.ap-northeast-2.amazonaws.com'], // S3 버킷 도메인 추가
    },
}

module.exports = nextConfig 