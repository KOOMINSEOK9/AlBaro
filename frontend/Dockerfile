# frontend/Dockerfile
# node:20-alpine 이미지를 사용하여 Node.js 20.x 버전을 기반으로 합니다. 이는 최신 Next.js와 호환됩니다.
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]