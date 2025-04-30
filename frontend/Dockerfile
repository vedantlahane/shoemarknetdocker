FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# For development mode
ENV NODE_ENV=development

# Expose Vite's default port
EXPOSE 5173

# Run the development server with host set to allow external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
