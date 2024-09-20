# Use Bun base image for development
FROM oven/bun:latest AS development

WORKDIR /app

# Copy package.json and bun.lockb for dependencies
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Use Bun base image for production
FROM oven/bun:latest AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy package.json and bun.lockb for production
COPY package.json bun.lockb ./

# Install only production dependencies
RUN bun install --production

# Copy the build files from the development stage

# Run the application using Bun
CMD ["bun", "run", "src/main.ts"]
