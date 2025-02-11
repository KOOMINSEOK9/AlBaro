# Node.js 20.x 버전 (Alpine 기반)
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사 후 의존성 설치
COPY package*.json ./

# .env 파일 복사
COPY .env .env


RUN npm install

# 프로젝트 소스 복사
COPY . .

# Next.js 빌드 실행
RUN npm run build

# 포트 개방
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]