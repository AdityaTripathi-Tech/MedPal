# 💙 Emotional Intelligence & Memory Feature

Your Agora AI Chatbot now has **emotional awareness** and **personal memory storage**! The AI understands when you're happy, sad, excited, angry, or anxious—and responds with empathy. Plus, it can remember your favorite moments!

## Features

### 1. 😊 Emotion Detection
The chatbot automatically detects your emotional state from your messages:

- **Happy** 😊: Detects "happy", "great", "wonderful", "awesome", "love", "enjoy", etc.
- **Sad** 😢: Detects "sad", "depressed", "unhappy", "lonely", "heartbroken", etc.
- **Angry** 😠: Detects "angry", "furious", "mad", "frustrated", "hate", etc.
- **Excited** 🤩: Detects "excited", "thrilled", "pumped", "can't wait", "amazing", etc.
- **Anxious** 😰: Detects "worried", "nervous", "scared", "stressed", "panic", etc.

### 2. 💙 Empathetic Responses
When the AI detects an emotion, it responds with empathy BEFORE answering:

**Example 1:**
```
You: "I'm really sad today. My dog passed away."
AI: "I can hear you're going through something difficult. I'm here to listen and support you. 💙

[Followed by helpful response]
```

**Example 2:**
```
You: "I just got promoted! I'm so excited!"
AI: "Your energy is incredible! I'm excited with you! 🚀

[Followed by celebratory response]
```

### 3. 💾 Memory Storage
Save important moments to your personal memory vault:

**How to save a memory:**
```
You: "I just adopted a cat! Save this memory"
AI: "💾 Memory saved! 'I just adopted a cat!'"
```

Or simply:
```
You: "Remember this: I finished my first marathon!"
AI: [Automatically saves the memory]
```

### 4. 📖 Memory Recall
Ask the chatbot to tell your story:

**Commands:**
- "Show me my memories"
- "Tell me my story"
- "What do you remember about me?"
- "Recall my memories"

**Response:**
```
📖 YOUR STORY
━━━━━━━━━━━━━━━━

Here's what I remember about you:

😊 When you were happy:
   • I got promoted today!
   • I just adopted a cat
   • Had an amazing vacation

💙 When you were sad:
   • Missing my old friends
   • Struggled with work stress

🤩 When you were excited:
   • Got into my dream university
   • First time traveling abroad
```

### 5. ⭐ Favorite Memories
Mark important memories as favorites and they appear in your sidebar:

**Sidebar displays:**
- Your current mood
- Favorite memories (tagged with emotion)
- Quick access to all memories

## How to Use

### In Demo Mode

1. **Open demo.html** in your browser
2. **Type naturally** - mention how you feel
3. **Watch the mood indicator** in the sidebar update
4. **Save important moments:**
   - Type: "I'm so happy! Save this memory"
   - Or: "Remember: I got the job!"
5. **Recall anytime:**
   - Type: "Tell me my story"
   - Or: "Show my memories"

### In Full-Stack Mode

Same features, but also backed by:
- OpenAI GPT-4 for empathy responses
- Backend `/memory` endpoint for persistence
- Session-based memory storage
- Optional database integration

## UI Features

### Mood Display (Sidebar)
Shows your current emotional state with emoji and name:
```
😊 Happy
😢 Sad
😠 Angry
🤩 Excited
😰 Anxious
😐 Neutral
```

### Emotion Indicators (Chat)
Next to each message, small indicator shows the detected emotion:
```
[user] 😊 I got engaged today!
[assistant] Your joy is beautiful! Let's celebrate...
```

### Favorite Memories Panel
Quick access to your starred moments:
```
💾 MY MEMORIES
┌─────────────────────┐
│ ⭐ Sad             │
│   Missing my dad    │
│ ⭐ Happy            │
│   Got promoted!     │
│ ☆ Excited          │
│   Traveling tomorrow│
└─────────────────────┘
📖 View All Memories
```

## Memory Data Structure

Each memory stores:
```json
{
  "id": 1700000000000,
  "content": "I got promoted today!",
  "emotion": "excited",
  "timestamp": "November 14, 2025, 2:30 PM",
  "isFavorite": true
}
```

## Backend Integration (Full-Stack)

### POST /memory
Save a memory:
```javascript
POST /memory
Body: {
  "sessionId": "session-123",
  "content": "I got married!",
  "emotion": "happy"
}
Response: { "memory": { id, content, emotion, timestamp, isFavorite } }
```

### GET /memories/:sessionId
Retrieve all memories:
```javascript
GET /memories/session-123
Response: { "memories": [...] }
```

### PUT /memory/:memoryId/favorite
Toggle favorite status:
```javascript
PUT /memory/1700000000000/favorite
Response: { "memory": { ...updated... } }
```

## Supported Emotion Keywords

### Happy 😊
happy, great, wonderful, awesome, excited, fantastic, love, enjoy, brilliant, joy, blessed, grateful, amazing, delighted

### Sad 😢
sad, unhappy, depressed, down, upset, miserable, lonely, heartbroken, struggle, loss, grief, painful, hurt, crying

### Angry 😠
angry, furious, mad, frustrated, annoyed, irritated, hate, terrible, furious, livid, enraged, resentful

### Excited 🤩
excited, thrilled, pumped, stoked, hyped, can't wait, amazing, love, thrilling, fantastic, outstanding

### Anxious 😰
worried, anxious, nervous, scared, afraid, stress, panic, overwhelmed, terrified, concerned, frightened, fearful

## Empathetic Response Examples

When **sad**:
- "I can hear you're going through something difficult. I'm here to listen and support you. 💙"
- "It's okay to feel sad sometimes. Would you like to talk about what's on your mind?"
- "Your feelings matter. Let me help you through this. You're not alone. 🤝"

When **happy**:
- "That's wonderful to hear! Your happiness is contagious! 🎉"
- "I'm so glad you're feeling great! That's amazing energy! ✨"
- "Your joy is beautiful! Let's celebrate this moment together! 🌟"

When **excited**:
- "Your energy is incredible! I'm excited with you! 🚀"
- "I love your passion! Let's channel this excitement into something great!"

When **anxious**:
- "I sense some worry. That's completely normal. Let's take this one step at a time. 💙"
- "You're safe here. Take a breath. How can I ease your mind?"

When **angry**:
- "I understand your frustration. It's valid to feel angry. Let's work through this together."
- "That sounds really challenging. Take a deep breath. How can I help you find peace?"

## Example Conversation

```
You: I'm feeling so overwhelmed. I have too much work and my family is stressing me out.

AI: I sense some worry. That's completely normal. Let's take this one step at a time. 💙

That sounds like you're juggling a lot right now. It's important to prioritize and maybe take breaks. 
Would you like to talk about what's most pressing?

You: Save this memory

AI: 💾 Memory saved! "I'm feeling so overwhelmed. I have too much work..."

You: I just finished the big project though! I'm so proud!

AI: Your energy is incredible! I'm excited with you! 🚀

Congratulations! Finishing a big project is a huge accomplishment. How does it feel?

You: Tell me my story

AI: 📖 YOUR STORY
━━━━━━━━━━━━━━━━

😰 When you were anxious:
   • I'm feeling so overwhelmed. I have too much work...

🤩 When you were excited:
   • I just finished the big project though! I'm so proud!
```

## Privacy & Data

**Demo Mode:**
- ✅ All memories stored in browser (localStorage/memory)
- ✅ No data sent anywhere
- ⚠️ Memories lost on browser refresh (unless localStorage is used)

**Full-Stack Mode:**
- ✅ Memories stored on server (in-memory or database)
- ✅ Associated with session ID
- ⚠️ Send data to OpenAI for response generation
- 🔒 Implement authentication for privacy

## Future Enhancements

- [ ] Mood trends over time (chart your emotional journey)
- [ ] AI suggestions based on mood ("Want to hear a joke?" when sad)
- [ ] Voice tone adjustment (sad voice, happy voice, calming voice)
- [ ] Notification reminders from memories
- [ ] Export memories as a journal/diary
- [ ] Share memories (with permission)
- [ ] Multi-user mood tracking
- [ ] Mood-based playlist suggestions
- [ ] Mental health resources when detecting distress
- [ ] Sentiment analysis for deeper emotion understanding

## Troubleshooting

**Q: My emotions aren't being detected**
- Make sure your message includes clear emotion keywords
- Try: "I'm so happy!", "I feel sad", "This makes me excited!"

**Q: Memories aren't saving**
- In demo mode, they're stored in memory (lost on refresh)
- Make sure to use "save this memory" or "remember this" phrases
- Check browser console for errors

**Q: Can't recall memories**
- Try different commands: "Show my story", "Tell me my memories", "Recall"
- Make sure you've saved at least one memory first

**Q: Empathy response not showing**
- The AI will only give empathy if it detects an emotion
- Add emotion keywords to your messages for better detection

## Tips for Best Experience

1. **Be expressive** - Use emotion words so the AI can detect your mood
2. **Save important moments** - Use the "save this memory" phrase naturally
3. **Ask for recall** - Periodically ask the AI to tell your story
4. **Mark favorites** - Click on memories to mark as favorite
5. **Use different contexts** - Share happy, sad, and excited moments for richer story

## Technical Details

- Emotion detection uses keyword matching (simple but effective)
- For production, consider Hugging Face Transformers for NLP
- Memory storage: in-memory Map (demo) → database (production)
- Empathy responses are hardcoded (production: AI-generated)

Enjoy your emotional AI companion! 💙
