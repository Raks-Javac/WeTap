# Build stage for User App
FROM node:20-alpine as user-build
WORKDIR /app/user
COPY user-app/package*.json ./
RUN npm install
COPY user-app/ ./
RUN npm run build

# Build stage for Admin App
FROM node:20-alpine as admin-build
WORKDIR /app/admin
COPY admin-app/package*.json ./
RUN npm install
COPY admin-app/ ./
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build assets
COPY --from=user-build /app/user/dist /usr/share/nginx/html/user
COPY --from=admin-build /app/admin/dist /usr/share/nginx/html/admin

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
