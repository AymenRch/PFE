# memoir/backend/Dockerfile
FROM node:22.11.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9000
CMD ["node", "server.js"]
