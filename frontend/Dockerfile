FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Copy the template to the correct location for auto-substitution
COPY default.conf.template /etc/nginx/templates/default.conf.template

RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 8080

# The official nginx image will handle variable substitution and starting nginx
CMD ["nginx", "-g", "daemon off;"]
