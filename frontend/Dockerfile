# Step 1: Build the frontend
FROM node:22-alpine AS build

WORKDIR /app

# Copy and install dependencies for the frontend
COPY package.json package-lock.json ./
RUN npm install

# Copy app files and build the frontend
COPY . .
RUN npm run build

# Step 2: Set up the production environment
FROM node:22-alpine

WORKDIR /app

# Copy built frontend files from the build stage
COPY --from=build /app/build /app/build

# Expose the port that the frontend will be served on
EXPOSE 8080
