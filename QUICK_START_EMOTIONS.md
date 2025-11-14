# 🎯 Emotional AI - Quick Reference Card

## 🚀 Start Here (5 minutes)

```powershell
# Option 1: Test Demo (No setup)
Invoke-Item demo.html

# Option 2: Start Backend (with Node.js)
cd server; npm run dev

# Option 3: Start Full-Stack (with Node.js + npm)
# Terminal 1:
cd server; npm install; npm run dev

# Terminal 2:
cd ../client; npm install; npm run dev
# Then visit: http://localhost:5173
```

---

## 💙 Features at a Glance

### Emotion Detection
```
Keyword Input → Detected Emotion → AI Response
"I'm happy" → 😊 Happy → "Your joy is beautiful!"
"I'm sad" → 😢 Sad → "I'm here for you 💙"
"I'm excited" → 🤩 Excited → "Your energy is amazing!"
"I'm angry" → 😠 Angry → "I understand your frustration"
"I'm worried" → 😰 Anxious → "Let's calm down together"
```

### Memory Commands
```
"Save this memory" → Saves message with emotion
"Show my memories" → Lists all saved memories
"Tell my story" → Groups memories by emotion
"Remember: ..." → Saves custom memory
```

---

## 📁 Key Files

| File | Purpose | Open With |
|------|---------|-----------|
| `demo.html` | Runnable demo (emotion + memory working) | Browser |
| `server/index.js` | Backend API server | Terminal |
| `client/src/components/ChatWindow.jsx` | React chat UI | VS Code |
| `BACKEND_EMOTION_MEMORY.md` | Implementation code | VS Code |
| `EMOTIONAL_AI_COMPLETE_GUIDE.md` | Feature guide | Browser/VS Code |
| `PHASE_IMPLEMENTATION_PLAN.md` | Step-by-step plan | VS Code |

---

## 🎯 Implementation Path (Pick One)

### Path A: Quick (5 min) ✅
```
1. Open demo.html
2. Type: "I'm so happy! Save this memory"
3. Type: "Tell me my story"
4. Watch emotions and memories work!
```

### Path B: Backend (30 min)
```
1. cd server
2. npm install sentiment
3. Copy /memory endpoints from BACKEND_EMOTION_MEMORY.md
4. npm run dev
5. Test endpoints with PowerShell/curl
```

### Path C: Full-Stack (90 min)
```
1. Path B: Backend integration
2. Update client/ChatWindow.jsx with memory state
3. Add axios calls to /memory endpoints
4. Start frontend: npm run dev
5. Test emotion + memory in React
```

### Path D: Production (6+ hours)
```
1. Path C: Full-stack working
2. Setup PostgreSQL database
3. Replace in-memory with database queries
4. Add sentiment.js NLP
5. Deploy to production
```

---

## 🎓 Code Snippets

### Detect Emotion (Backend)
```javascript
const emotionKeywords = {
  happy: ['happy', 'great', 'wonderful', 'awesome'],
  sad: ['sad', 'unhappy', 'depressed', 'lonely'],
  excited: ['excited', 'thrilled', 'pumped', 'amazing'],
  angry: ['angry', 'furious', 'mad', 'frustrated'],
  anxious: ['worried', 'nervous', 'scared', 'stressed']
};

function detectEmotion(text) {
  const lower = text.toLowerCase();
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(k => lower.includes(k))) return emotion;
  }
  return 'neutral';
}
```

### Save Memory (Backend)
```javascript
app.post('/memory', (req, res) => {
  const { sessionId, content, emotion } = req.body;
  const memory = {
    id: Date.now(),
    content,
    emotion,
    timestamp: new Date().toISOString(),
    isFavorite: false
  };
  // Save to database here
  res.json(memory);
});
```

### Get Memories (Frontend)
```javascript
const getMemories = async () => {
  const res = await axios.get(`/memories/${sessionId}`);
  setMemories(res.data);
};
```

### Display Mood (React)
```jsx
const emotionEmoji = {
  happy: '😊',
  sad: '😢',
  excited: '🤩',
  angry: '😠',
  anxious: '😰',
  neutral: '😐'
};

<div className="mood">
  <span>{emotionEmoji[currentMood]}</span>
  <span>{currentMood}</span>
</div>
```

---

## 🔌 API Endpoints (Phase 1)

### Save Memory
```
POST /memory
Body: { sessionId, content, emotion }
Response: { id, content, emotion, timestamp, isFavorite }
```

### Get Memories
```
GET /memories/:sessionId
Response: [ { id, content, emotion, timestamp, isFavorite }, ... ]
```

### Toggle Favorite
```
PUT /memory/:memoryId/favorite
Response: { id, ..., isFavorite: true/false }
```

### Delete Memory
```
DELETE /memory/:memoryId
Response: { success: true }
```

---

## 🧪 Quick Test Commands

### Test Backend
```powershell
# Save memory
$body = @{
  sessionId = "user123"
  content = "I got promoted!"
  emotion = "happy"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/memory" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

# Get memories
Invoke-WebRequest -Uri "http://localhost:3000/memories/user123" -Method GET

# Favorite memory
Invoke-WebRequest -Uri "http://localhost:3000/memory/1700000000000/favorite" -Method PUT
```

### Test Frontend
```
1. Open http://localhost:5173
2. Type: "I'm so excited!"
3. Watch mood display update
4. Type: "Save this memory"
5. Type: "Tell me my story"
6. Verify memories show
```

---

## ✅ Checklist for Each Phase

### Phase 1: Backend (30 min)
- [ ] `npm install sentiment` in server folder
- [ ] Copy /memory endpoints to server/index.js
- [ ] Update /chat to return emotion
- [ ] Test endpoints with PowerShell
- [ ] Verify responses work

### Phase 2: React (60 min)
- [ ] Add memory state to ChatWindow.jsx
- [ ] Add axios functions (saveMemory, getMemories, etc)
- [ ] Create UI components (MoodDisplay, MemoryPanel)
- [ ] Update message display with emotion badges
- [ ] Handle "save memory" and "tell story" commands
- [ ] Test in browser

### Phase 3: Database (90 min)
- [ ] Setup PostgreSQL
- [ ] Create memories table
- [ ] npm install pg
- [ ] Update backend to use database
- [ ] Test persistence (restart server, verify data exists)

### Phase 4: NLP (40 min)
- [ ] Replace keyword matching with sentiment.js
- [ ] Test emotion detection accuracy
- [ ] Add custom patterns for edge cases
- [ ] Verify emotion detection is 70%+ accurate

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Emotions not detected in demo.html | Use clear keywords: "happy", "sad", etc |
| /memory endpoint returns 404 | Copy endpoints to server/index.js, restart server |
| React shows no memories | Check backend is running, verify /memories endpoint works |
| Database connection error | Check PostgreSQL is running, verify DATABASE_URL in .env |
| Slow emotion detection | Upgrade to sentiment.js (Phase 4) |

---

## 📊 Feature Matrix

| Feature | Demo | Phase 1 | Phase 2 | Phase 3 |
|---------|------|--------|--------|---------|
| Emotion Detect | ✅ | ✅ | ✅ | ✅ |
| Empathy Resp | ✅ | ✅ | ✅ | ✅ |
| Memory Save | ✅ In-mem | ✅ | ✅ | ✅ DB |
| Memory Recall | ✅ | ✅ | ✅ | ✅ |
| Persist Restart | ❌ | ❌ | ❌ | ✅ |
| Multi-session | ❌ | ✅ | ✅ | ✅ |

---

## 🎯 Priority Matrix

```
         High Impact     |  Low Impact
High Effort  Phase 3 DB  |  Phase 4 NLP
             Phase 5 AI  |
             
Low Effort   Phase 1 API |  Demo.html
             Phase 2 UI  |  Docs
```

**Recommended order:** Demo.html → Phase 1 → Phase 2 → Phase 3

---

## 💾 Database Schema (Phase 3)

```sql
CREATE TABLE memories (
  id SERIAL PRIMARY KEY,
  sessionId VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  emotion VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isFavorite BOOLEAN DEFAULT FALSE,
  INDEX idx_sessionId (sessionId)
);

-- Example queries:
SELECT * FROM memories WHERE sessionId = 'user123';
UPDATE memories SET isFavorite = true WHERE id = 1;
DELETE FROM memories WHERE id = 1;
```

---

## 🚀 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Emotion Detection | <100ms | Keyword: 1ms |
| Memory Save | <500ms | In-mem: 1ms |
| Memory Retrieve | <500ms | In-mem: 1ms |
| Chat Response | <2s | OpenAI: 1-3s |
| Load Time | <1s | ~800ms |

---

## 📞 Documentation Quick Links

- **User Guide:** EMOTIONAL_INTELLIGENCE.md
- **Dev Guide:** BACKEND_EMOTION_MEMORY.md
- **Complete Guide:** EMOTIONAL_AI_COMPLETE_GUIDE.md
- **Implementation Plan:** PHASE_IMPLEMENTATION_PLAN.md
- **Project Overview:** README.md

---

## 🎉 Success Milestones

```
✅ Milestone 1: Demo.html emotion detection works
   → You can test features immediately

✅ Milestone 2: Backend /memory endpoints working
   → API is ready for frontend to use

✅ Milestone 3: React shows memories and mood
   → Full-stack emotion AI working

✅ Milestone 4: Memories persist in database
   → Production-ready system

✅ Milestone 5: Better NLP detection
   → 80%+ emotion accuracy

✅ Milestone 6: AI-generated empathy
   → Personalized responses
```

---

## 💡 Pro Tips

1. **Test demo.html FIRST** - Validates features without setup
2. **Backend is foundation** - Phase 1 endpoints used by all other phases
3. **React is UI** - Phase 2 makes the backend accessible
4. **Database is optional** - In-memory works for MVP/demo
5. **NLP is nice** - Keyword matching works surprisingly well
6. **AI responses cost money** - Consider for v2

---

## 🎯 Next Steps

**Recommended:**
1. Read this file (5 min) ✅
2. Open demo.html and test (5 min)
3. Read BACKEND_EMOTION_MEMORY.md (10 min)
4. Implement Phase 1 (30 min)
5. Implement Phase 2 (60 min)

**Total: ~110 minutes to working full-stack**

Choose an action:
- `"Open demo.html"` → See it working now
- `"Implement Phase 1"` → Backend integration
- `"Implement Phase 2"` → React integration
- `"Tell me more"` → Ask any questions

---

**Last Updated:** November 14, 2025
**Version:** 2.0 - Emotional Intelligence & Memory
**Status:** ✅ Ready for implementation
