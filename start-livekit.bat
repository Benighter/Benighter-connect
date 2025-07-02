@echo off
title LiveKit Video Conferencing
color 0A

echo.
echo ========================================
echo   LiveKit Video Conferencing Solution
echo ========================================
echo.

echo Starting LiveKit Meet application...
echo.
echo The app will be available at:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

cd livekit-meet
npm run dev

pause
