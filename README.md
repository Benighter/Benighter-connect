# LiveKit Video Conferencing Solution

This workspace contains a complete video conferencing solution based on **LiveKit**, which is the best open-source alternative to Zoom with full functionality.

## What's Included

### 1. LiveKit Server (`./livekit/`)
- **Full-featured WebRTC SFU (Selective Forwarding Unit)**
- Written in Go for high performance
- Supports unlimited participants
- Advanced features:
  - Screen sharing
  - Recording and playback
  - Real-time chat
  - Breakout rooms
  - Noise cancellation (Krisp integration)
  - End-to-end encryption
  - Speaker detection
  - Simulcast for optimal quality
  - Webhooks and APIs

### 2. LiveKit Meet Web App (`./livekit-meet/`)
- **Modern React/Next.js video conferencing application**
- Professional UI similar to Zoom/Google Meet
- Features:
  - HD video calls with multiple participants
  - Screen sharing
  - Chat functionality
  - Virtual backgrounds
  - Device settings (camera, microphone)
  - Recording capabilities
  - Mobile responsive design

## Quick Start

### Prerequisites
- Node.js 18+ (✅ Installed: v20.11.1)
- Go 1.23+ (for LiveKit server - optional for demo)

### Running the Application

1. **Start the LiveKit Meet Web App:**
   ```bash
   cd livekit-meet
   npm run dev
   ```

2. **Open your browser:**
   - Navigate to: http://localhost:3000
   - The application is now running! 🎉

### ✅ **Issue Fixed:**
- **Background Images:** Resolved missing background image imports
- **Virtual Backgrounds:** Now working properly with placeholder images
- **Build Errors:** All module resolution issues fixed

### Current Configuration
- **Server URL:** `wss://meet.livekit.io` (using LiveKit's demo server)
- **API Key:** `devkey` (demo credentials)
- **Port:** 3000 (web application)

## Features Comparison

| Feature | LiveKit | Zoom | BigBlueButton | Jitsi Meet |
|---------|---------|------|---------------|------------|
| **Open Source** | ✅ | ❌ | ✅ | ✅ |
| **Self-Hostable** | ✅ | ❌ | ✅ | ✅ |
| **Unlimited Participants** | ✅ | 💰 | ✅ | ⚠️ |
| **Screen Sharing** | ✅ | ✅ | ✅ | ✅ |
| **Recording** | ✅ | ✅ | ✅ | ✅ |
| **Mobile Apps** | ✅ | ✅ | ✅ | ✅ |
| **API/SDK** | ✅ | ✅ | ✅ | ✅ |
| **Modern Architecture** | ✅ | ✅ | ⚠️ | ⚠️ |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | N/A | ⭐⭐ | ⭐⭐⭐⭐ |

## Why LiveKit?

1. **Production Ready:** Powers ChatGPT's Advanced Voice Mode for millions of users
2. **Modern Stack:** Built with latest WebRTC standards and Go for performance
3. **Comprehensive SDKs:** JavaScript, React, Swift, Android, Flutter, Unity, Rust
4. **Enterprise Features:** E2E encryption, recording, webhooks, analytics
5. **Scalable:** Distributed architecture, multi-region support
6. **Developer Friendly:** Excellent documentation, active community

## Advanced Setup (Production)

### Self-Hosting LiveKit Server

1. **Install LiveKit Server:**
   ```bash
   # macOS
   brew install livekit
   
   # Linux
   curl -sSL https://get.livekit.io | bash
   
   # Windows
   # Download from: https://github.com/livekit/livekit/releases/latest
   ```

2. **Start LiveKit Server:**
   ```bash
   livekit-server --dev
   ```

3. **Update Configuration:**
   - Edit `livekit-meet/.env.local`
   - Set `LIVEKIT_URL=ws://localhost:7880`
   - Set your own API keys

### LiveKit Cloud (Recommended)

For production use, consider [LiveKit Cloud](https://cloud.livekit.io/):
- Managed infrastructure
- Global edge network
- Free tier available
- Enterprise support

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

### Environment Variables

Create `.env.local` in `livekit-meet/` directory:

```env
# Required
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
LIVEKIT_URL=wss://your-livekit-server.com

# Optional
NEXT_PUBLIC_SHOW_SETTINGS_MENU=true
NEXT_PUBLIC_LK_RECORD_ENDPOINT=/api/record
```

## API Integration

LiveKit provides comprehensive APIs for:
- **Room Management:** Create, list, delete rooms
- **Participant Control:** Mute, kick, grant permissions
- **Recording:** Start/stop recordings, export to cloud storage
- **Webhooks:** Real-time events for integration
- **Analytics:** Usage metrics and call quality data

## Mobile Apps

LiveKit supports native mobile development:
- **iOS/macOS:** Swift SDK with SwiftUI components
- **Android:** Kotlin SDK with Compose components
- **Flutter:** Cross-platform SDK
- **React Native:** JavaScript SDK (beta)

## Support & Documentation

- **Documentation:** https://docs.livekit.io
- **GitHub:** https://github.com/livekit/livekit
- **Community:** https://livekit.io/join-slack
- **Examples:** https://github.com/livekit-examples

## License

- **LiveKit Server:** Apache 2.0
- **LiveKit Meet:** MIT
- **Commercial Use:** Fully supported

---

**🎉 Your LiveKit video conferencing solution is now running!**

Visit http://localhost:3000 to start your first video call.
