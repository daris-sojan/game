@echo off
echo.
echo ========================================
echo   FlappyBird CV Web App Launcher
echo ========================================
echo.

REM Try Python 3.11 first (recommended for MediaPipe compatibility)
py -3.11 --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python 3.11...
    py -3.11 run_web_app.py
    goto :end
)

REM Try Python 3.10 as fallback
py -3.10 --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python 3.10...
    py -3.10 run_web_app.py
    goto :end
)

REM Try default Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using default Python...
    python run_web_app.py
    goto :end
)

REM If no Python found
echo ERROR: Python not found!
echo Please install Python 3.10 or 3.11 from https://python.org
echo.
pause

:end
echo.
echo Press any key to exit...
pause >nul
