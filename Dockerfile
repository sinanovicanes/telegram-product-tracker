# Use the Bun Alpine image
FROM oven/bun:alpine

# Set the working directory
WORKDIR /app

# Copy your application code
COPY . .

# Install your application dependencies
RUN bun install

# Install the required browsers for Puppeteer
# RUN bunx puppeteer browsers install

# Installs Chromium (100) package.
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/lib/chromium/chrome

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["bun", "run", "start"]
