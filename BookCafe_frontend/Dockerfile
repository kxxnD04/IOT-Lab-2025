# Stage 1: Build the React application
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Increase memory limit for Node.js to prevent out-of-memory errors.
# The SIGKILL signal during `npm run build` suggests the process was killed
# due to excessive memory consumption. 4096 (4GB) is a safe value.
ENV NODE_OPTIONS=--max-old-space-size=4096

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
# Vite will use the .env file at this stage
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (the default port for Nginx)
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
