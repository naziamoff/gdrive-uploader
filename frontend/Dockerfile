# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve static files with a lightweight web server
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/build /usr/share/frontend

# Install a simple HTTP server (serve)
RUN npm install -g serve

# Start frontend
CMD ["serve", "-s", "/usr/share/frontend", "-l", "3001"]
