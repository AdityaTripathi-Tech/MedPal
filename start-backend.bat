@echo off
REM Simple launcher to start the Agora AI Chatbot with Python backend

echo ========================================
echo Agora AI - Emotional Chatbot Launcher
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found
    pause
    exit /b 1
)

echo Starting Python Flask backend...
echo.
echo The backend will start on http://localhost:5000
echo.
echo After it starts, open your browser and go to:
echo   file:///c:/Users/smang/OneDrive/Documents/agora/demo.html
echo.
echo Press Ctrl+C in this window to stop the server
echo.

python server/app.py
pause
