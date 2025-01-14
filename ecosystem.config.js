module.exports = {
    apps: [
      {
        name: 'admin',        // Replace with your application's name
        script: './dist/app.js',        // Replace with your main application file
        instances: 1,            // Adjust according to your needs
        autorestart: true,       // Enable automatic restart
        watch: false,            // Set to true to auto-reload the app on file changes
        max_memory_restart: '1G', // Restart the app if memory usage exceeds this value
  
      }
      // Add more apps as needed
    ],
  
  };
  
