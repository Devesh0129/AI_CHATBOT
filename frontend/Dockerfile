# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock first to leverage Docker caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all project files into the container
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Command to start the app
CMD ["yarn", "dev", "--host"]
