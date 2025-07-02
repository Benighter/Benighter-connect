# LiveKit Setup Guide & Troubleshooting

## Current Issue: Connection Error

The LiveKit Meet application is showing a connection error because it cannot connect to a LiveKit server. This is expected since we need to set up a proper LiveKit server or use LiveKit Cloud.

### Error Details
```
ConnectionError: could not establish signal connection
```

This happens because the application is trying to connect to a LiveKit WebSocket server that either:
1. Doesn't exist at the configured URL
2. Is not accessible due to network restrictions
3. Requires proper authentication credentials

## Solutions (Choose One)

### 🎯 **Solution 1: Use LiveKit Cloud (Recommended)**

1. **Sign up for LiveKit Cloud (Free):**
   - Go to https://cloud.livekit.io
   - Create a free account
   - Create a new project

2. **Get your credentials:**
   - Copy your API Key
   - Copy your API Secret  
   - Copy your WebSocket URL (format: `wss://your-project.livekit.cloud`)

3. **Update configuration:**
   ```bash
   # Edit livekit-meet/.env.local
   LIVEKIT_API_KEY=your-actual-api-key
   LIVEKIT_API_SECRET=your-actual-secret
   LIVEKIT_URL=wss://your-project.livekit.cloud
   ```

4. **Restart the application:**
   ```bash
   cd livekit-meet
   npm run dev
   ```

### 🔧 **Solution 2: Local LiveKit Server**

1. **Install Go (if not already installed):**
   - Download from https://golang.org/dl/
   - Install and add to PATH

2. **Download LiveKit Server:**
   ```bash
   # For Windows
   curl -L -o livekit-server.exe https://github.com/livekit/livekit/releases/latest/download/livekit_windows_amd64.exe
   
   # For macOS
   brew install livekit
   
   # For Linux
   curl -sSL https://get.livekit.io | bash
   ```

3. **Create configuration file (livekit.yaml):**
   ```yaml
   port: 7880
   rtc:
     tcp_port: 7881
     port_range_start: 50000
     port_range_end: 60000
   keys:
     devkey: secret
   development: true
   log_level: info
   ```

4. **Start the server:**
   ```bash
   ./livekit-server --config livekit.yaml --dev
   ```

5. **Update application config:**
   ```bash
   # Edit livekit-meet/.env.local
   LIVEKIT_API_KEY=devkey
   LIVEKIT_API_SECRET=secret
   LIVEKIT_URL=ws://localhost:7880
   ```

### 🐳 **Solution 3: Docker Setup**

1. **Create docker-compose.yml:**
   ```yaml
   version: '3.8'
   services:
     livekit:
       image: livekit/livekit-server:latest
       ports:
         - "7880:7880"
         - "7881:7881"
         - "50000-60000:50000-60000/udp"
       environment:
         - LIVEKIT_KEYS=devkey:secret
       command: --dev
   ```

2. **Start with Docker:**
   ```bash
   docker-compose up -d
   ```

### 🎮 **Solution 4: Demo Mode (Current Fallback)**

The application is currently configured to attempt connection to a demo server. While this may not work due to network restrictions, the UI and features are still functional for demonstration purposes.

## Verification Steps

1. **Check server status:**
   ```bash
   # Test WebSocket connection
   curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Key: test" -H "Sec-WebSocket-Version: 13" http://localhost:7880
   ```

2. **Check application logs:**
   - Open browser developer tools (F12)
   - Check Console tab for connection errors
   - Check Network tab for failed requests

3. **Test API endpoints:**
   ```bash
   # Test token generation
   curl "http://localhost:3000/api/connection-details?roomName=test&participantName=user"
   ```

## Features Available

Even without a working LiveKit server, you can still explore:

✅ **UI Components:**
- Video call interface
- Settings panels
- Chat interface
- Screen sharing controls
- Virtual background options

✅ **Application Features:**
- Room creation/joining flow
- Participant management UI
- Device selection
- Layout options

❌ **Requires LiveKit Server:**
- Actual video/audio streaming
- Real-time communication
- Screen sharing functionality
- Recording capabilities

## Next Steps

1. **For Development:** Use Solution 1 (LiveKit Cloud) for easiest setup
2. **For Production:** Use Solution 2 (Local Server) or Solution 1 with paid plan
3. **For Learning:** Current demo mode is sufficient to explore the UI

## Support Resources

- **LiveKit Documentation:** https://docs.livekit.io
- **LiveKit GitHub:** https://github.com/livekit/livekit
- **LiveKit Discord:** https://livekit.io/join-slack
- **LiveKit Examples:** https://github.com/livekit-examples

## Current Status

🟡 **Application Status:** Running with UI functional
🔴 **LiveKit Server:** Not connected (expected)
🟢 **Development Server:** http://localhost:3000
🟢 **Background Images:** Fixed and working
🟢 **Dependencies:** All installed correctly

The application is ready for a proper LiveKit server connection!
