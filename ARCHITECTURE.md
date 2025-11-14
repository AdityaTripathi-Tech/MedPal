# Architecture Diagram - Medicine Prescription Reader

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│                       (demo.html OR React)                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Chat Window                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ Messages Display (User & AI)                        │ │  │
│  │  │                                                     │ │  │
│  │  │ [User message]                                      │ │  │
│  │  │ [AI response]                                       │ │  │
│  │  │ [Prescription data]                                 │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  │  Input Composer                                            │  │
│  │  [Type message...] [Send]                                 │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Sidebar Controls                                        │  │
│  │                                                          │  │
│  │  📞 Voice Controls:                                      │  │
│  │     [Join Voice] [End Call] [Mute]                      │  │
│  │                                                          │  │
│  │  🎤 Speech:                                              │  │
│  │     [Speak STT] [Play Reply]                            │  │
│  │                                                          │  │
│  │  💊 Prescription: ← NEW SECTION                          │  │
│  │     [📤 Upload Image]                                    │  │
│  │     [🔍 Read Prescription]                               │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────┬──────────────────────────────────────────────────┘
               │
        [DEMO MODE]
      (Browser Only)
               │
        ┌──────▼─────────┐
        │ Browser APIs:  │
        │ • FileReader   │
        │ • Fetch        │
        │ • TTS          │
        │ • STT          │
        └────────────────┘
               │
        [FULL-STACK MODE]
      (Browser + Server)
               │
               ▼
        ┌─────────────────────────────────────────┐
        │        EXPRESS SERVER                   │
        │      (Node.js Backend)                  │
        │                                         │
        │  Endpoints:                             │
        │  • POST /token (Agora)                  │
        │  • POST /chat (LLM)                     │
        │  • POST /prescription ← NEW             │
        │  • GET /history (Session)               │
        │                                         │
        └─────────────┬──────────────────────────┘
                      │
        ┌─────────────┴──────────────┬─────────────────┐
        │                            │                 │
        ▼                            ▼                 ▼
   [OPENAI API]            [AGORA SERVICE]      [LOCAL STORAGE]
                                                (In-Memory Map)
   GPT-4 Chat             RTC Tokens           Conversation
   GPT-4 Vision           ──────────            History
   (Prescription)
```

## Data Flow - Prescription Reading

```
Step 1: User Selects Image
┌─────────────┐
│ demo.html   │
│ [Upload]    │
└──────┬──────┘
       │
       ▼
   FileReader converts image to Base64
       │
       ▼
   State: uploadedImageBase64 = "data:image/jpeg;base64,..."
       │
       │
Step 2: User Clicks "Read Prescription"
       │
       ├─ Demo Mode:                      ├─ Full-Stack Mode:
       │  localStorage                      │ Backend
       │  │                                 │
       │  ▼                                 │  ▼
       │  parsePrescription()               │  POST /prescription
       │  │                                 │  │
       │  ├─ Select mock data              │  ▼
       │  │  (simulated prescription)      │  OpenAI API
       │  │                                 │  │
       │  └─ Return JSON                    │  ├─ Model: gpt-4-vision
       │                                    │  │
       │                                    │  ├─ Analyze image
       │                                    │  │
       │                                    │  └─ Extract medicines
       │                                    │
       │                                    ▼
       │                          Return: {
       │                            patientName,
       │                            doctor,
       │                            date,
       │                            medications: [...]
       │                          }
       │
       ▼
   Display in Chat:
   ┌──────────────────────────────┐
   │ 💊 PRESCRIPTION DETAILS      │
   │ Patient: John Doe            │
   │ Doctor: Dr. Sarah            │
   │ Date: Nov 14, 2025           │
   │                              │
   │ Medications:                 │
   │ 1. Metformin 500mg x2 daily │
   │    Duration: 3 months        │
   │                              │
   │ 2. Lisinopril 10mg daily    │
   │    Duration: Ongoing         │
   └──────────────────────────────┘
       │
       ▼
   Auto Text-to-Speech:
   "Prescription for John Doe...
    Medicine one: Metformin..."
```

## Component Hierarchy

```
ChatApp (Main Component)
│
├─ State Management
│  ├─ messages: array
│  ├─ input: string
│  ├─ sessionId: string
│  ├─ inCall: boolean
│  ├─ uploadedImageBase64: string ← NEW
│  └─ ...
│
├─ Browser APIs
│  ├─ SpeechRecognition (STT)
│  ├─ SpeechSynthesis (TTS)
│  ├─ FileReader (Image upload)
│  └─ Fetch API (Server calls)
│
├─ Event Handlers
│  ├─ sendMessage()
│  ├─ joinCall()
│  ├─ toggleMute()
│  ├─ toggleSTT()
│  ├─ playLastReply()
│  ├─ handleImageUpload() ← NEW
│  └─ readPrescription() ← NEW
│
└─ UI Sections
   ├─ Header (Title + Status)
   ├─ Chat Panel
   │  ├─ Messages Display
   │  └─ Message Input
   ├─ Sidebar Controls
   │  ├─ Voice Controls
   │  ├─ Speech Controls
   │  ├─ 💊 Prescription Section ← NEW
   │  └─ Session Info
   └─ Forms
      ├─ Message Composer
      └─ File Upload Input ← NEW
```

## API Request/Response Flow

```
PRESCRIPTION ENDPOINT FLOW:

Request:
┌─────────────────────────────────────────────┐
│ POST /prescription                          │
│ Content-Type: application/json              │
│                                             │
│ {                                           │
│   "sessionId": "session-abc123",            │
│   "imageBase64":                            │
│     "data:image/jpeg;base64,..."            │
│ }                                           │
└────────────────────┬────────────────────────┘
                     │
                     ▼
            ┌───────────────────────┐
            │  Express Middleware   │
            │ • Parse JSON          │
            │ • Verify image        │
            └───────────────────────┘
                     │
                     ▼
            ┌───────────────────────┐
            │  OpenAI API Call      │
            │ • Model: gpt-4-vision │
            │ • Input: image        │
            │ • Prompt: extract...  │
            └───────────────────────┘
                     │
                     ▼
            ┌───────────────────────┐
            │  Parse Response       │
            │ • Extract JSON        │
            │ • Validate data       │
            └───────────────────────┘
                     │
Response:            ▼
┌─────────────────────────────────────────────┐
│ HTTP 200 OK                                 │
│ Content-Type: application/json              │
│                                             │
│ {                                           │
│   "prescription": {                         │
│     "patientName": "John Doe",              │
│     "date": "November 14, 2025",            │
│     "doctor": "Dr. Sarah Johnson",          │
│     "medications": [                        │
│       {                                     │
│         "name": "Metformin",                │
│         "dosage": "500mg",                  │
│         "frequency": "Twice daily",         │
│         "duration": "3 months"              │
│       }                                     │
│     ]                                       │
│   }                                         │
│ }                                           │
└─────────────────────────────────────────────┘
```

## Database Schema (Future Enhancement)

```
prescriptions table:
┌──────────────────────────────────────┐
│ id (primary key)                     │
│ userId (foreign key)                 │
│ sessionId                            │
│ imageUrl (S3/cloud storage)          │
│ patientName                          │
│ doctorName                           │
│ prescriptionDate                     │
│ uploadedAt (timestamp)               │
│ expiresAt (timestamp)                │
│ medications (JSON array)             │
└──────────────────────────────────────┘

medications table (normalized):
┌──────────────────────────────────────┐
│ id (primary key)                     │
│ prescriptionId (foreign key)         │
│ name                                 │
│ dosage                               │
│ frequency                            │
│ duration                             │
│ notes                                │
└──────────────────────────────────────┘
```

## Feature Interaction Map

```
                    DEMO MODE
                (Browser Only)
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
    Chat Text-to-  Speech-to-  Prescription
    Features Text     Text       Reading
                                  │
                        ┌─────────┼─────────┐
                        │         │         │
                        ▼         ▼         ▼
                    Upload   Parse    Display
                    Image    Data     Results
                        │
                        ├─ FileReader API
                        ├─ Local JSON parsing
                        └─ Mock data generation
                        

                  FULL-STACK MODE
            (Browser + Node Backend)
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
    Agora   Chat with  Prescription
    Voice   OpenAI     with Vision
    Calls   LLM        API
              │
              ├─ Browser ← sends request
              │
              ▼
         Backend Server
         - Express
         - Middleware
         - Route handlers
              │
              └─ OpenAI API
                 ├─ Chat completions
                 └─ Vision analysis
```

---

This architecture supports:
- ✅ Standalone demo mode (no dependencies)
- ✅ Full-stack production deployment
- ✅ Modular and extensible design
- ✅ Real-time voice + text + prescription reading
- ✅ Session-based conversation history
- ✅ Easy integration with additional services
