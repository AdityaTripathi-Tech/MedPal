# Backend Integration: Emotional Intelligence & Memory

Guide for adding emotion detection and memory storage to the full-stack backend (Node.js + Express + OpenAI).

## New Backend Endpoints

### 1. POST /memory - Save a Memory
```
POST /memory
Content-Type: application/json

Request Body:
{
  "sessionId": "session-abc123",
  "content": "I got promoted today!",
  "emotion": "happy"
}

Response:
{
  "success": true,
  "memory": {
    "id": 1700000000000,
    "sessionId": "session-abc123",
    "content": "I got promoted today!",
    "emotion": "happy",
    "timestamp": "2025-11-14T14:30:00Z",
    "isFavorite": false
  }
}
```

### 2. GET /memories/:sessionId - Get All Memories
```
GET /memories/session-abc123

Response:
{
  "success": true,
  "memories": [
    {
      "id": 1700000000000,
      "content": "I got promoted today!",
      "emotion": "happy",
      "timestamp": "2025-11-14T14:30:00Z",
      "isFavorite": true
    },
    ...
  ]
}
```

### 3. PUT /memory/:memoryId/favorite - Toggle Favorite
```
PUT /memory/1700000000000/favorite
Content-Type: application/json

Request Body:
{
  "sessionId": "session-abc123"
}

Response:
{
  "success": true,
  "memory": {
    ...
    "isFavorite": true
  }
}
```

### 4. DELETE /memory/:memoryId - Delete Memory
```
DELETE /memory/1700000000000
Content-Type: application/json

Request Body:
{
  "sessionId": "session-abc123"
}

Response:
{
  "success": true,
  "message": "Memory deleted"
}
```

## Backend Implementation

### Step 1: Update package.json
Add sentiment analysis library:
```json
{
  "dependencies": {
    "sentiment": "^6.1.0"
  }
}
```

### Step 2: Add to server/index.js

```javascript
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// Memory storage (replace with database for production)
const memories = new Map(); // memoryId -> memory object

// ============ EMOTION DETECTION ============
function detectEmotionSentiment(text) {
    const result = sentiment.analyze(text);
    const score = result.score; // -1 to 1
    
    if (score > 0.5) return 'happy';
    if (score > 0.1) return 'excited';
    if (score < -0.5) return 'sad';
    if (score < -0.1) return 'angry';
    return 'neutral';
}

// ============ MEMORY ENDPOINTS ============
// Save a memory
app.post('/memory', (req, res) => {
    try {
        const { sessionId = 'default', content, emotion } = req.body;
        if (!content) return res.status(400).json({ error: 'content required' });

        const memoryId = Date.now();
        const memory = {
            id: memoryId,
            sessionId,
            content,
            emotion: emotion || detectEmotionSentiment(content),
            timestamp: new Date().toISOString(),
            isFavorite: false
        };

        memories.set(memoryId, memory);

        // Also store in session history
        const session = getSession(sessionId);
        session.push({
            role: 'system',
            content: `[Memory saved: "${content}"]`
        });

        res.json({ success: true, memory });
    } catch (err) {
        console.error('Memory save error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get all memories for a session
app.get('/memories/:sessionId', (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const sessionMemories = Array.from(memories.values())
            .filter(m => m.sessionId === sessionId);
        
        res.json({ success: true, memories: sessionMemories });
    } catch (err) {
        console.error('Get memories error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Toggle favorite memory
app.put('/memory/:memoryId/favorite', (req, res) => {
    try {
        const memoryId = parseInt(req.params.memoryId);
        const memory = memories.get(memoryId);
        
        if (!memory) return res.status(404).json({ error: 'Memory not found' });
        
        memory.isFavorite = !memory.isFavorite;
        res.json({ success: true, memory });
    } catch (err) {
        console.error('Favorite toggle error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a memory
app.delete('/memory/:memoryId', (req, res) => {
    try {
        const memoryId = parseInt(req.params.memoryId);
        
        if (!memories.has(memoryId)) {
            return res.status(404).json({ error: 'Memory not found' });
        }
        
        memories.delete(memoryId);
        res.json({ success: true, message: 'Memory deleted' });
    } catch (err) {
        console.error('Memory delete error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ============ UPDATE CHAT ENDPOINT ============
// Modify existing /chat endpoint to include emotion detection
app.post('/chat', async (req, res) => {
    try {
        const { sessionId = 'default', message } = req.body;
        if (!message) return res.status(400).json({ error: 'message required' });

        const session = getSession(sessionId);
        
        // Detect emotion from user message
        const emotion = detectEmotionSentiment(message);
        
        session.push({ 
            role: 'user', 
            content: message,
            metadata: { emotion }
        });

        // Build messages for AI
        const context = session.slice(-12).filter(m => m.role !== 'system');

        // Add emotion-aware system prompt
        const systemPrompt = emotion !== 'neutral' 
            ? `You are a helpful and empathetic assistant. The user is currently feeling ${emotion}. Respond with understanding and compassion while being helpful.`
            : 'You are a helpful and empathetic assistant.';

        const messages = [
            { role: 'system', content: systemPrompt },
            ...context
        ];

        // Call OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages
        });

        const aiMessage = response.choices[0].message.content;
        session.push({ 
            role: 'assistant', 
            content: aiMessage,
            metadata: { emotion }
        });

        res.json({ 
            reply: aiMessage, 
            emotion,
            userEmotion: emotion
        });
    } catch (err) {
        console.error('Chat error', err);
        res.status(500).json({ error: err.message });
    }
});
```

### Step 3: Frontend Integration (React)

Update `client/src/components/ChatWindow.jsx`:

```jsx
// Add memory state
const [memories, setMemories] = useState([])

// Save memory function
const saveMemory = async (content, emotion) => {
    try {
        const res = await axios.post(`${SERVER_ORIGIN}/memory`, {
            sessionId,
            content,
            emotion
        })
        setMemories(prev => [...prev, res.data.memory])
    } catch (err) {
        console.error('Error saving memory:', err)
    }
}

// Get memories function
const getMemories = async () => {
    try {
        const res = await axios.get(`${SERVER_ORIGIN}/memories/${sessionId}`)
        setMemories(res.data.memories)
    } catch (err) {
        console.error('Error fetching memories:', err)
    }
}

// Detect memory save commands in sendMessage
const handleSendMessage = async (text) => {
    if (text.toLowerCase().includes('save this memory') || 
        text.toLowerCase().includes('remember this')) {
        await saveMemory(text, 'user-defined')
    }
    // ... rest of send logic
}
```

## Database Schema (for Production)

### Memories Table
```sql
CREATE TABLE memories (
  id BIGINT PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  emotion VARCHAR(50),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_favorite BOOLEAN DEFAULT FALSE,
  INDEX (session_id)
);
```

### Emotion Keywords Table (Optional)
```sql
CREATE TABLE emotion_keywords (
  id INT PRIMARY KEY AUTO_INCREMENT,
  emotion VARCHAR(50) NOT NULL,
  keyword VARCHAR(100) NOT NULL,
  weight FLOAT DEFAULT 1.0,
  UNIQUE KEY (emotion, keyword)
);
```

## Using NLP for Better Emotion Detection

### Option 1: Hugging Face Transformers
```javascript
const transformers = require('@xenova/transformers');

async function detectEmotionHF(text) {
    const pipe = await transformers.pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
    );
    
    const result = await pipe(text);
    return result[0].label.toLowerCase(); // POSITIVE, NEGATIVE
}
```

### Option 2: Google Cloud Natural Language
```javascript
const language = require('@google-cloud/language');

async function detectEmotionGoogle(text) {
    const client = new language.LanguageServiceClient();
    
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };
    
    const request = { document };
    const [result] = await client.analyzeSentiment(request);
    const sentiment = result.documentSentiment;
    
    // Use sentiment.score (-1.0 to 1.0)
    if (sentiment.score > 0.5) return 'happy';
    if (sentiment.score < -0.5) return 'sad';
    return 'neutral';
}
```

## Rate Limiting for Memory Operations

```javascript
const memoryLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Max 100 memories per hour
    message: 'Too many memories saved'
});

app.post('/memory', memoryLimiter, (req, res) => { ... });
```

## Error Handling

```javascript
// Handle missing session
if (!sessionId) {
    return res.status(400).json({ error: 'sessionId required' });
}

// Handle invalid emotion
const validEmotions = ['happy', 'sad', 'angry', 'excited', 'anxious', 'neutral'];
if (emotion && !validEmotions.includes(emotion)) {
    return res.status(400).json({ error: 'Invalid emotion' });
}

// Handle memory size limits
if (memory.content.length > 5000) {
    return res.status(400).json({ error: 'Memory content too long' });
}
```

## API Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (missing fields) |
| 404 | Memory not found |
| 500 | Server error |

## Testing with curl/PowerShell

```powershell
# Save memory
$body = @{
    sessionId = "session-123"
    content = "I got promoted!"
    emotion = "happy"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/memory" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"

# Get memories
Invoke-WebRequest -Uri "http://localhost:3001/memories/session-123"

# Toggle favorite
Invoke-WebRequest -Uri "http://localhost:3001/memory/1700000000000/favorite" `
  -Method PUT `
  -Body '{"sessionId":"session-123"}' `
  -ContentType "application/json"
```

This completes the backend integration for emotional intelligence and memory features!
