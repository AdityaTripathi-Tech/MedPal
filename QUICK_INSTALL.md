# 🚀 QUICK START - Manual Installation (3 Steps)

## Step 1: Install Python Packages

```powershell
cd c:\Users\smang\OneDrive\Documents\agora
pip install -r requirements.txt
```

**Takes ~2-3 minutes**

Packages being installed:
- Flask (web framework)
- Flask-CORS (cross-origin support)
- TextBlob (sentiment analysis)
- NLTK (NLP tools)
- Spacy (advanced NLP)
- python-dotenv (config)
- openai (API client)

---

## Step 2: Download NLP Data

```powershell
# TextBlob corpora
python -m textblob.download_corpora

# NLTK VADER sentiment data
python -c "import nltk; nltk.download('vader_lexicon')"

# SpaCy language model (optional but recommended)
python -m spacy download en_core_web_sm
```

**Takes ~3-5 minutes** (downloads are 100-500MB each)

---

## Step 3: Start the Servers

### Terminal 1: Backend
```powershell
cd c:\Users\smang\OneDrive\Documents\agora
python server/app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Terminal 2: Frontend
```powershell
cd c:\Users\smang\OneDrive\Documents\agora\client
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxxms

  ➜  Local:   http://localhost:5173/
```

### Open Browser
```
http://localhost:5173
```

---

## 🎉 That's It!

Now type in the chatbox:
- "I'm so excited!" → Watch the mood emoji update to 🚀
- "I feel sad" → Mood updates to 😢
- "show memories" → See all saved memories
- "save memory" → Explicitly save a message

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "pip: command not found" | Use: `python -m pip install -r requirements.txt` |
| "VADER not found" | Run: `python -c "import nltk; nltk.download('vader_lexicon')"` |
| "TextBlob error" | Run: `python -m textblob.download_corpora` |
| "Port 5000 in use" | Kill: `Get-NetTCPConnection -LocalPort 5000 \| Stop-Process -Force` |
| "Frontend can't reach backend" | Check Flask is running, verify URL is `http://localhost:5000` |

---

## Verify Installation

```powershell
# Test Python packages
python -c "import flask, textblob, nltk; print('✓ All packages installed!')"

# Test VADER
python -c "from nltk.sentiment import SentimentIntensityAnalyzer; print('✓ VADER ready!')"

# Test TextBlob
python -c "from textblob import TextBlob; print('✓ TextBlob ready!')"
```

---

## Architecture

```
http://localhost:5173 (React Frontend)
        ↓ Axios HTTP
http://localhost:5000 (Flask Backend)
        ↓
NLP Engines:
├─ TextBlob (sentiment)
├─ VADER (intensity)
└─ Keywords (emotion mapping)
        ↓
Emotion: "excited" (95% confident)
Memory: Auto-saved
Response: Empathetic message
```

---

## Performance

| Operation | Speed |
|-----------|-------|
| First request | 100-200ms |
| Normal requests | 10-50ms |
| Memory operations | <100ms |
| **Feels like** | Instant! ⚡ |

---

## Files Needed

✅ `server/app.py` - Backend (already created)
✅ `client/src/components/ChatWindow.jsx` - Frontend (already updated)
✅ `requirements.txt` - Dependencies (already created)

**Everything is already in place! Just run the installation steps above.**

---

## Command Cheat Sheet

```powershell
# Navigate to project
cd c:\Users\smang\OneDrive\Documents\agora

# Install packages
pip install -r requirements.txt

# Download NLP data
python -m textblob.download_corpora
python -c "import nltk; nltk.download('vader_lexicon')"

# Start backend
python server/app.py

# Start frontend (in different terminal)
cd client
npm run dev

# Open browser
http://localhost:5173
```

---

## Expected Result

✅ Frontend loads at http://localhost:5173
✅ Type "I'm happy!" 
✅ Mood emoji updates to 😊
✅ Emotion badge shows on response
✅ Memory auto-saves to sidebar
✅ Empathetic response displayed
✅ No console errors

---

## Success Criteria

When you see this, you're good to go:

```
Backend: Running on http://127.0.0.1:5000
Frontend: Local: http://localhost:5173
Browser: Page loads without errors
Chat: "I'm excited!" → 🚀 emoji appears
Memory: Auto-saves in sidebar
```

---

## Next Steps

1. ✅ Run the 3 installation steps above
2. ✅ Open http://localhost:5173
3. ✅ Start chatting
4. ✅ Watch emotion detection in action
5. ✅ Explore memory features

---

**Estimated total time: ~10-15 minutes**
**Complexity: Easy!**
**Status: Ready to install!**

🚀 **Let's go!**
