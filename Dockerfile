# ---------- Build Stage ----------
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---------- Production Stage ----------
FROM node:24-alpine

WORKDIR /app

# Install a lightweight static file server
RUN npm install -g serve

# Copy the built app from builder
COPY --from=builder /app/dist ./dist

# Serve on port 3000
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "dist", "-l", "3000"]
