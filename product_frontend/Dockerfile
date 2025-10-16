# Use official Node.js LTS image
FROM node:current-alpine3.22

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set the API endpoint for build time
ARG VITE_PRODUCT_BACKEND_ENDPOINT=http://localhost:3000
ENV VITE_PRODUCT_BACKEND_ENDPOINT=$VITE_PRODUCT_BACKEND_ENDPOINT

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 4173

# Start the application in preview mode
CMD ["npm", "run", "preview"]