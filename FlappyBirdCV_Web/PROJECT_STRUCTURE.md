# FlappyBird CV Web App - Project Structure

## Directory Structure
```
FlappyBirdCV-Web/
├── web_app.py              # Main Flask application with game logic
├── run_web_app.py          # Launcher script with dependency checking
├── start_web_app.bat       # Windows batch file for easy launching
├── requirements.txt        # Python dependencies
├── README.md              # Main documentation
├── PROJECT_STRUCTURE.md   # This file
└── templates/
    └── index.html         # Web interface with game canvas and controls
```

## File Descriptions

### Core Application Files

**`web_app.py`**
- Main Flask application
- Socket.IO server for real-time communication
- MediaPipe face tracking integration
- Game state management and logic
- Video frame processing

**`templates/index.html`**
- Complete web interface
- HTML5 Canvas for game rendering
- JavaScript game engine
- Socket.IO client integration
- Responsive CSS design
- Camera access and video processing

### Launcher Scripts

**`run_web_app.py`**
- Cross-platform Python launcher
- Dependency checking and installation
- User-friendly startup messages
- Error handling and troubleshooting

**`start_web_app.bat`**
- Windows batch file launcher
- Automatic Python version detection
- Fallback to different Python versions
- User-friendly for non-technical users

### Configuration Files

**`requirements.txt`**
- Python package dependencies
- Specific versions for compatibility
- Includes Flask, Socket.IO, OpenCV, MediaPipe

**`README.md`**
- Complete user documentation
- Installation and usage instructions
- Troubleshooting guide
- Technical specifications

## Key Components

### Backend (Python)
- **Flask**: Web framework
- **Socket.IO**: Real-time bidirectional communication
- **MediaPipe**: Face landmark detection
- **OpenCV**: Video frame processing
- **NumPy**: Numerical operations

### Frontend (JavaScript/HTML)
- **HTML5 Canvas**: Game rendering
- **WebRTC**: Camera access
- **Socket.IO Client**: Real-time communication
- **Responsive CSS**: Mobile-friendly design

### Game Logic
- **GameState Class**: Manages game state and physics
- **Collision Detection**: Bird vs pipe collision
- **Scoring System**: Points and stage progression
- **Face Tracking**: Nose position to bird movement

## Data Flow

1. **Camera Capture**: Browser captures video frames
2. **Frame Transmission**: Frames sent to server via Socket.IO
3. **Face Detection**: MediaPipe processes frames for landmarks
4. **Game Update**: Nose position updates bird position
5. **State Broadcast**: Updated game state sent to all clients
6. **Rendering**: Canvas renders game with new state

## Installation Methods

### Method 1: Quick Start
```bash
cd FlappyBirdCV-Web
python run_web_app.py
```

### Method 2: Windows Batch File
```cmd
double-click start_web_app.bat
```

### Method 3: Manual
```bash
pip install -r requirements.txt
python web_app.py
```

## Browser Compatibility

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome  | ✅      | ✅     | Best performance |
| Firefox | ✅      | ✅     | Full support |
| Safari  | ✅      | ✅     | iOS/macOS |
| Edge    | ✅      | ✅     | Windows |

## Technical Requirements

### Server Requirements
- Python 3.10+ (3.11 recommended)
- 2GB RAM minimum
- Webcam access
- Network connectivity

### Client Requirements
- Modern web browser
- WebRTC support
- Camera permission
- JavaScript enabled

## Performance Considerations

### Optimization Features
- Frame rate limiting (10 FPS for face detection)
- Efficient Canvas rendering
- Minimal data transmission
- Responsive design scaling

### Resource Usage
- **CPU**: Moderate (MediaPipe processing)
- **Memory**: ~200MB (Python + dependencies)
- **Network**: Low bandwidth (compressed frames)
- **Browser**: Standard HTML5 features

## Security Features

### Data Privacy
- No frame storage on server
- Local processing only
- No user data collection
- Secure WebSocket connections

### Access Control
- Camera permission required
- Local network access only
- No external API calls
- CORS protection enabled

## Future Enhancements

### Planned Features
- [ ] Multiplayer support
- [ ] Leaderboard system
- [ ] Game replay system
- [ ] Mobile app version
- [ ] Voice control integration

### Technical Improvements
- [ ] WebGL rendering
- [ ] WebAssembly optimization
- [ ] Progressive Web App (PWA)
- [ ] Offline mode support
- [ ] Advanced gesture recognition

## Troubleshooting

### Common Issues
1. **Camera not working**: Check permissions
2. **Game not responding**: Verify face visibility
3. **Performance issues**: Close other applications
4. **Connection errors**: Check firewall settings

### Debug Mode
Run with debug enabled:
```bash
python web_app.py  # Debug mode enabled by default
```

### Log Files
- Server logs: Console output
- Browser logs: F12 Developer Tools
- MediaPipe warnings: Normal operation

This structure provides a complete, self-contained web application for the FlappyBird CV game with professional organization and documentation.
