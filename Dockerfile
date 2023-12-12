# Stage 1: Build the application
FROM node:16-alpine AS build

# We default to use port 8080 in our service
ENV PORT=80

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false


WORKDIR /app

# Copy package.json and package-lock.json

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the application

RUN npm run build

# Stage 2: Create the production image with Nginx
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
