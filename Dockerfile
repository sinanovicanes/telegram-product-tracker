# Use the Bun Alpine image
FROM oven/bun:alpine AS builder

# Set the working directory
WORKDIR /app

# Copy your application code
COPY . .

# Install your application dependencies
RUN bun install --production
RUN bun build --compile --minify --sourcemap ./src/main.ts --outfile app.exe

FROM alpine AS production

WORKDIR /app

# Install the required browsers for Puppeteer
# RUN bunx puppeteer browsers install
# Installs Chromium (100) package.
RUN apk update && apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/lib/chromium/chrome
COPY --from=builder /app/app.exe ./app.exe

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["./app.exe"]
