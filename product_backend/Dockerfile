# Use official Node.js LTS image
FROM node:current-alpine3.22

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
