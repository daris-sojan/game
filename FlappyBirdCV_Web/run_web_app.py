#!/usr/bin/env python3
"""
FlappyBird CV Web App Launcher
Run this script to start the web-based version of FlappyBird CV
"""

import sys
import subprocess
import os

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import flask
        import flask_socketio
        import cv2
        import mediapipe
        import numpy
        print("✓ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"✗ Missing dependency: {e}")
        return False

def install_dependencies():
    """Install required dependencies"""
    print("Installing web app dependencies...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ])
        print("✓ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("✗ Failed to install dependencies")
        return False

def main():
    print("🐦 FlappyBird CV Web App Launcher 🎮")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists("web_app.py"):
        print("✗ Please run this script from the FlappyBirdCV-Web directory")
        return
    
    # Check dependencies
    if not check_dependencies():
        print("\nWould you like to install the required dependencies? (y/n): ", end="")
        if input().lower().startswith('y'):
            if not install_dependencies():
                return
        else:
            print("Cannot run without dependencies. Exiting.")
            return
    
    print("\n🚀 Starting FlappyBird CV Web App...")
    print("📱 Open your browser and go to: http://localhost:5000")
    print("🎯 Make sure to allow camera access when prompted")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 40)
    
    try:
        # Import and run the web app
        from web_app import app, socketio
        socketio.run(app, debug=False, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n👋 Shutting down FlappyBird CV Web App")
    except Exception as e:
        print(f"\n❌ Error running web app: {e}")

if __name__ == "__main__":
    main()
