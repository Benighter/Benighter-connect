// Configuration for Benighter Connect
const CONFIG = {
  // Backend server URL - Update this after deploying to Render
  BACKEND_URL: 'https://benighter-connect-backend.onrender.com', // Render deployment URL
  
  // Development URL (for local testing)
  DEV_BACKEND_URL: 'http://localhost:3002',
  
  // Determine which URL to use
  getBackendUrl: function() {
    // Use production URL if we're not on localhost
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return this.BACKEND_URL;
    }
    return this.DEV_BACKEND_URL;
  }
};

// Make it globally available
window.CONFIG = CONFIG;
