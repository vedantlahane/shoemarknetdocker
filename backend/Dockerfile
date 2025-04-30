FROM node:20-slim

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# Set environment variable
ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]
