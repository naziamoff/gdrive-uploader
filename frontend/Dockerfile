# Step 1: Build the frontend
FROM node:22-alpine AS build

WORKDIR /app

# Copy and install dependencies for the frontend
COPY package.json package-lock.json ./
RUN npm install

# Copy app files and build the frontend
COPY . .
RUN npm run build

# Step 2: Set up the production environment with Nginx
FROM nginx:alpine

# Copy the built frontend files into the Nginx server's public directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port that Nginx will be serving on
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
