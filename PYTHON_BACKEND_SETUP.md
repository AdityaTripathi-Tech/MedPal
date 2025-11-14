# Python Flask Backend Setup Guide

## Overview
This Python Flask backend provides advanced emotion detection (10+ emotion types) with VADER sentiment analysis, TextBlob processing, and empathetic responses.

## Installation

### 1. Install Python Dependencies
```powershell
# Navigate to the agora directory
cd c:\Users\smang\OneDrive\Documents\agora

# Install all required packages
pip install -r requirements.txt

# Download NLTK data for VADER sentiment analysis
python -m textblob.download_corpora
python -c "import nltk; nltk.download('vader_lexicon')"

# Download spaCy language model
python -m spacy download en_core_web_sm
```

### 2. Create `.env` file (optional)
```
PORT=5000
OPENAI_API_KEY=your_key_here
```

### 3. Run the Flask Server
```powershell
# Windows PowerShell
python server/app.py

# Or use Flask development server
flask --app server.app run --debug
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check
```
GET /health
```
Response: `{"status": "healthy", "service": "Emotional AI Backend"}`

### 2. Chat with Emotion Detection
```
POST /chat
Content-Type: application/json

{
  "sessionId": "user123",
  "message": "I'm so excited about this amazing opportunity!"
}
```

Response:
```json
{
  "reply": "🚀 Your enthusiasm is inspiring! Tell me more!...",
  "emotion": "excited",
  "confidence": 0.95,
  "intensity": "high",
  "analysis": {
    "emotion": "excited",
    "confidence": 0.95,
    "intensity": "high",
    "score": 4.2,
    "polarity": 0.82,
    "vader_compound": 0.87,
    "details": {
      "excited": 4.2,
      "happy": 2.1,
      "confident": 1.5
    }
  }
}
```

### 3. Save Memory
```
POST /memory
Content-Type: application/json

{
  "sessionId": "user123",
  "content": "Today I passed my certification exam!",
  "emotion": "excited"  // optional, will auto-detect
}
```

Response: Memory object with ID, timestamp, emotion tag

### 4. Get Memories
```
GET /memories/user123
```

Response: Array of all memories for the session

### 5. Toggle Favorite
```
PUT /memory/1234567890/favorite
Content-Type: application/json

{
  "sessionId": "user123"
}
```

### 6. Delete Memory
```
DELETE /memory/1234567890
Content-Type: application/json

{
  "sessionId": "user123"
}
```

### 7. Test Emotion Detection
```
POST /emotions-test
Content-Type: application/json

{
  "texts": [
    "I'm so happy!",
    "This makes me angry",
    "I'm really worried",
    "What an amazing surprise!"
  ]
}
```

## Emotion Types Detected

The system detects the following 10+ emotion types:

1. **Happy** - Joy, contentment, pleasure
2. **Sad** - Sorrow, grief, depression
3. **Angry** - Rage, frustration, irritation
4. **Excited** - Enthusiasm, anticipation
5. **Anxious** - Worry, fear, nervousness
6. **Loving** - Affection, compassion, tenderness
7. **Grateful** - Thankfulness, appreciation
8. **Surprised** - Astonishment, shock
9. **Confident** - Pride, strength, determination
10. **Peaceful** - Calm, serenity, tranquility

## How Advanced Emotion Detection Works

The system uses a multi-layered approach:

### Layer 1: Keyword Matching
- 180+ keywords mapped to 10 emotion types
- Detects intensifiers ("very", "so", "extremely")
- Handles negations ("don't", "isn't")

### Layer 2: TextBlob Sentiment Analysis
- Polarity score (-1 to 1): negative to positive
- Subjectivity score (0 to 1): objective to subjective
- Maps polarity ranges to emotions

### Layer 3: VADER Sentiment Analysis
- Compound score (-1 to 1): overall sentiment intensity
- More nuanced understanding of emotional language
- Better at detecting capitalization, punctuation emphasis

### Layer 4: Confidence Scoring
- Combines all layers into a single confidence score
- Returns secondary emotions for richness
- Provides intensity levels (very low → very high)

## Example Usage from React

In `ChatWindow.jsx`:

```javascript
// Send message with emotion detection
const response = await axios.post('http://localhost:5000/chat', {
  sessionId: user.uid,
  message: userInput
});

// Extract emotion data
const { emotion, confidence, intensity, analysis } = response.data;

// Save memory if emotion detected
if (confidence > 0.5) {
  await axios.post('http://localhost:5000/memory', {
    sessionId: user.uid,
    content: userInput,
    emotion: emotion
  });
}
```

## Troubleshooting

### Module Not Found Errors
```powershell
# Install all packages again
pip install -r requirements.txt --upgrade

# Verify installation
python -c "import flask, textblob, nltk; print('All imports OK')"
```

### VADER Lexicon Not Found
```powershell
python -c "import nltk; nltk.download('vader_lexicon')"
```

### TextBlob Missing Corpora
```powershell
python -m textblob.download_corpora
```

### CORS Issues
Backend is configured with Flask-CORS. If you get CORS errors, update `server/app.py`:
```python
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
```

## Production Considerations

For production deployment:

1. **Database**: Replace in-memory storage with SQLite or PostgreSQL
2. **Authentication**: Add JWT token validation
3. **Rate Limiting**: Implement per-user rate limits
4. **Logging**: Use proper logging instead of print()
5. **Error Handling**: More granular error responses
6. **Performance**: Add caching for frequently analyzed emotions

## Next Steps

1. ✅ Install requirements: `pip install -r requirements.txt`
2. ✅ Download NLTK data (one-time setup)
3. ✅ Run server: `python server/app.py`
4. ✅ Test with React frontend
5. ⏳ Integrate with ChatWindow.jsx
6. ⏳ Complete React UI components for mood/memory display

## Files

- `server/app.py` - Main Flask application
- `requirements.txt` - Python dependencies
- `client/src/components/ChatWindow.jsx` - React component (update needed)
- `demo.html` - Standalone demo (working reference)
