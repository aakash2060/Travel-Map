FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including nodemon
RUN npm install
RUN npm install -g nodemon

# Copy the rest of the application
COPY . .

COPY entrypoint.sh ./entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x ./entrypoint.sh

EXPOSE 8001

CMD ["npm", "run", "dev"]