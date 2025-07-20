# FlappyBird CV - Web App Edition 🐦🎮

A web-based version of the computer vision controlled Flappy Bird game that runs in your browser!

## Features ✨

- **Browser-based gameplay** - No need to install desktop applications
- **Real-time face tracking** - Uses your webcam to track nose movement
- **Responsive design** - Works on desktop and mobile devices
- **Live video feed** - See yourself while playing
- **Real-time multiplayer ready** - Built with Socket.IO for future multiplayer features

## How to Run 🚀

### Option 1: Quick Start (Recommended)
```bash
cd FlappyBirdCV-Web
python run_web_app.py
```

### Option 2: Manual Setup
1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the web app:
```bash
python web_app.py
```

3. Open your browser and go to: `http://localhost:5000`

## How to Play 🎯

1. **Allow Camera Access** - Click "Start Camera" and allow browser access to your webcam
2. **Position Yourself** - Make sure your face is clearly visible in the video feed
3. **Control the Bird** - Move your head up and down to control the bird's vertical position
4. **Avoid Pipes** - Navigate through the gaps between pipes
5. **Score Points** - Each pipe you pass through increases your score
6. **Progressive Difficulty** - The game gets harder every 10 seconds

## Technical Details 🔧

### Architecture
- **Backend**: Flask + Socket.IO for real-time communication
- **Frontend**: HTML5 Canvas + JavaScript for game rendering
- **Computer Vision**: MediaPipe for face landmark detection
- **Video Processing**: OpenCV for frame processing

### Key Components
- `web_app.py` - Main Flask application with game logic
- `templates/index.html` - Web interface with game canvas
- `run_web_app.py` - Launcher script with dependency checking

### Browser Compatibility
- **Chrome/Chromium** - Full support ✅
- **Firefox** - Full support ✅
- **Safari** - Full support ✅
- **Edge** - Full support ✅

### Mobile Support
- Responsive design adapts to mobile screens
- Touch-friendly controls
- Camera access works on mobile browsers

## Requirements 📋

### Python Dependencies
- Flask 2.3.3+
- Flask-SocketIO 5.3.6+
- OpenCV 4.11.0+
- MediaPipe 0.10.21+
- NumPy 1.26.4+

### Browser Requirements
- Modern browser with WebRTC support
- Camera access permission
- JavaScript enabled

## Troubleshooting 🔧

### Camera Not Working
- Ensure browser has camera permission
- Check if camera is being used by another application
- Try refreshing the page
- Check browser console for error messages

### Game Not Responding
- Make sure your face is well-lit and clearly visible
- Position yourself centered in the camera view
- Check network connection for real-time updates

### Performance Issues
- Close other browser tabs to free up resources
- Ensure good lighting for better face detection
- Try reducing video quality in browser settings

## Development 👨‍💻

### Running in Development Mode
```bash
python web_app.py
```
This runs with debug mode enabled for development.

### Customization
- Modify game parameters in `GameState` class
- Adjust video processing frequency in JavaScript
- Customize styling in the HTML template

## Future Enhancements 🚀

- [ ] Multiplayer support
- [ ] Leaderboard system
- [ ] Different game modes
- [ ] Mobile app version
- [ ] Voice control option
- [ ] Gesture-based controls

## Original vs Web Version 📊

| Feature | Desktop Version | Web Version |
|---------|----------------|-------------|
| Installation | Requires Python setup | Browser-based |
| Camera Access | Direct OpenCV | WebRTC API |
| Performance | Native speed | Network dependent |
| Sharing | Local only | URL shareable |
| Updates | Manual | Automatic |
| Platform | Desktop only | Cross-platform |

Enjoy playing FlappyBird CV in your browser! 🎮✨
