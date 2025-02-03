# frontend/Dockerfile
FROM node:14 AS build
WORKDIR /app
COPY package.json ./ 
RUN npm ci  # npm install 대신 npm ci 사용
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]