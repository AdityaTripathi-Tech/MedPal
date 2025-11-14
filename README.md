# Agora Conversational AI Chatbot

This repository contains a full-stack demo that combines Agora for real-time voice communication and OpenAI for conversational AI.

High-level structure:
- `server/` - Node.js Express backend (Agora token generation, chat proxy to OpenAI)
- `client/` - React (Vite) frontend with chat UI and Agora call wiring
- `demo.html` - Standalone browser demo (no Node.js required!)

Features:
- ✨ **Text chat with OpenAI** (session-scoped conversation memory)
- 📞 **Agora RTC token generation** endpoint for frontend to join voice channels
- 🎨 **Minimal UI** with dark, futuristic theme
- 🎤 **Optional: STT** via Web Speech API and **TTS** via browser speechSynthesis
- 💊 **Medicine Prescription Reader** - Upload an image of your prescription and the AI extracts all medicine details!
- **NEW:** 💙 **Emotional Intelligence** - AI detects if you're happy, sad, excited, angry, or anxious and responds with empathy
- **NEW:** 💾 **Personal Memory Storage** - Save your favorite memories and ask the AI to tell your story!

## Quick start (Windows PowerShell)

### 🚀 Try the Demo First (No Setup Required!)

```powershell
Invoke-Item "C:\Users\smang\OneDrive\Documents\agora\demo.html"
```

Open in any browser. Features:
- Full chat with AI
- Speech-to-text (microphone button)
- Text-to-speech (play reply)
- **Upload prescription image and read medicine details!**
- Mock Agora voice channel

### Full-Stack Setup (Requires Node.js)

1. Copy `.env.example` to `.env` in `server/` and fill values:
   - `OPENAI_API_KEY`, `AGORA_APP_ID`, `AGORA_APP_CERTIFICATE`

2. Start the backend

```powershell
cd .\server
npm install
npm run dev
```

By default the server runs on `http://localhost:3001`.

3. Start the frontend

```powershell
cd ..\client
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## 💊 Medicine Prescription Reader

**New Feature**: Upload an image of a prescription and the AI will extract:
- Patient name
- Doctor name
- Prescription date
- All medicines with dosage, frequency, and duration

See [PRESCRIPTION_FEATURE.md](./PRESCRIPTION_FEATURE.md) for detailed usage.

### Demo Mode
In `demo.html`, click **📤 Upload Image** → select prescription → click **🔍 Read Prescription**

### Full-Stack
Backend endpoint: `POST /prescription` with image data (requires GPT-4 Vision API key)

## 💙 Emotional Intelligence & Memory

**New Feature**: The AI now understands your emotions and remembers your stories!

- **Emotion Detection**: AI detects when you're happy, sad, excited, angry, or anxious
- **Empathetic Responses**: Gets special empathetic reply based on detected emotion
- **Memory Storage**: Save important moments by saying "save this memory"
- **Story Recall**: Ask "tell me my story" to hear all your saved memories
- **Mood Tracking**: Sidebar shows your current mood with emoji

**Try it:**
```
You: "I'm so excited! I got promoted today! Save this memory"
AI: "Your energy is incredible! I'm excited with you! 🚀"
    [Saves memory with 'excited' emotion]

You: "Tell me my story"
AI: "📖 YOUR STORY - Here's what I remember about you..."
```

See [EMOTIONAL_INTELLIGENCE.md](./EMOTIONAL_INTELLIGENCE.md) for full guide and [BACKEND_EMOTION_MEMORY.md](./BACKEND_EMOTION_MEMORY.md) for backend setup.

## Agora SDK (voice calls)

The client attempts to dynamically import `agora-rtc-sdk-ng`. To enable voice calls, install the SDK in the client:

```powershell
cd client
npm install agora-rtc-sdk-ng
```

If you prefer CDN usage, you can also include the appropriate script tag in `index.html`.

## Agora SDK (voice calls)

The client attempts to dynamically import `agora-rtc-sdk-ng`. To enable voice calls, install the SDK in the client:

```powershell
cd client
npm install agora-rtc-sdk-ng
```

If you prefer CDN usage, you can also include the appropriate script tag in `index.html`.

## Notes

- This project uses an in-memory session store. For production, persist conversation history in a database.
- The OpenAI integration uses the `openai` node package. Choose the model that fits your quota and needs.
- STT/TTS here are browser-based (Web Speech API). For higher accuracy or emotion-aware TTS, integrate cloud providers (Whisper, ElevenLabs, etc.).

## Next steps / Optional

- Group multi-user calls (Agora channel membership and message routing)
- Add durable conversation storage
- Add emotion-based TTS via a provider supporting voice styles
- Add authentication and per-user sessions

