@echo off
REM Python Flask Backend Installation Script for Windows

echo ========================================
echo Agora AI - Python Backend Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo [OK] Python found: 
python --version
echo.

REM Install pip packages
echo [*] Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install packages
    pause
    exit /b 1
)
echo [✓] Packages installed successfully
echo.

REM Download NLTK data
echo [*] Downloading NLTK VADER lexicon...
python -c "import nltk; nltk.download('vader_lexicon')"
echo [✓] NLTK data downloaded
echo.

REM Download TextBlob corpora
echo [*] Downloading TextBlob corpora...
python -m textblob.download_corpora
echo [✓] TextBlob corpora downloaded
echo.

REM Download spaCy model
echo [*] Downloading spaCy language model...
python -m spacy download en_core_web_sm
echo [✓] spaCy model downloaded
echo.

echo ========================================
echo [✓] Installation Complete!
echo ========================================
echo.
echo To run the server, use:
echo   python server/app.py
echo.
echo The server will start on http://localhost:5000
echo.
pause
