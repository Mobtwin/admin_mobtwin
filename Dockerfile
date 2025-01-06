# Use a Debian-based Node.js image as the base image
FROM node:20 AS production
# Set NODE_ENV to production
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /var/www/admin_mobtwin

# Copy only the production dependencies
COPY package*.json ./
RUN npm ci --only=production
RUN npm install pm2 -g

# Copy the built application (dist folder) from the pipeline
COPY dist ./dist

# Expose the port that your API service listens on
EXPOSE 3004


# Start the application
ENTRYPOINT ["pm2", "start", "ecosystem.config.js", "--no-daemon"]
