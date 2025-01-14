# Use a Debian-based Node.js image as the base image
FROM node:20 AS stage
# Set NODE_ENV to production
ENV NODE_ENV=production
RUN npm install pm2 -g
FROM stage
# Set the working directory inside the container
WORKDIR /var/www/admin_mobtwin

# Copy only the production dependencies
# COPY package*.json ./
COPY . .
RUN npm ci --only=production

# Copy the built application (dist folder) from the pipeline
# COPY dist ./dist
# COPY ecosystem.config.js ./ecosystem.config.js

# Expose the port that your API service listens on
EXPOSE 8080


# Start the application
ENTRYPOINT ["pm2", "start", "ecosystem.config.js", "--no-daemon"]
