# Use minimal Node image
# might have to use an ECR public image if we run into rate limit from Dockerhub
# FROM public.ecr.aws/docker/library/node:18-alpine
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy remaining files
COPY . .

EXPOSE 8001

# Run the server
CMD ["node", "server.js"]
