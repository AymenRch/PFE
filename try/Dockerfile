# memoir/try/Dockerfile

# Step 1: Build the React app
FROM node:22.11.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx serves on
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
