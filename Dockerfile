# Use a Debian-based Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /var/www/admin_mobtwin

# Copy the rest of the application code to the working directory
COPY . .

# Install dependencies using NPM
RUN npm install \
    && npm run build

# Install PM2 globally
RUN npm install pm2 -g

# Expose the port that your API service listens on
EXPOSE 3004


# Start the application
ENTRYPOINT ["pm2", "start", "ecosystem.config.js", "--no-daemon"]
