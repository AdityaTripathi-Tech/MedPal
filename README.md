## MedPal
#  MedPal – Your Conversational Health Companion  
### A GDG Delhi Hackathon 2025 Project  
### Team: **Aditya Tripathi** & **Swati Mangla**

---

##  Overview  
**MedPal** is an AI-powered medication reminder and conversational health companion designed for elderly patients like Mr. Sharma, who often forget their medicines due to handwritten notes or memory limitations.

This project addresses the Hackathon problem:

> *“Create a conversational solution that reminds users to take medicines and helps them understand doctor instructions, making health management intuitive and regular.”*

MedPal combines **AI, Vision, Voice, Supabase, and animation** to create a friendly, supportive experience for elderly users.

---

#  Key Features

### 🔹 1. AI Conversational Health Assistant  
- Powered by **Google Gemini AI** &  **Agora AI**
- Friendly and simple responses  
- Emotion-awareness (sad, confused, worried → responds gently)  
- Personalized greetings for each user  

---

### 🔹 2. Prescription OCR (Image to Medicine Schedule)  
- Upload prescription image  
- AI extracts:
  - Medicine name  
  - Dosage  
  - Frequency  
- Auto-creates the user’s medication timetable  

---

### 🔹 3. Smart Medication Reminders  
- Sends reminders for each medicine  
- Tracks taken/missed doses  
- Daily + weekly adherence dashboard  
- Stored securely in **Supabase Database**  

---

### 🔹 4. Caregiver Dashboard  
Family or doctor can check:  
- Daily reminders  
- Missed vs taken doses  
- Long-term adherence logs  

---

### 🔹 5. NEW: Animated Robot Health Greeter 🤖  
A unique hackathon feature that makes MedPal emotionally engaging:

- Robot **walks into the screen**  
- Waves gently  
- Greets user by name  
- Asks about their health  
- Uses **Gemini AI** to generate messages  
- Speaks using **Text-to-Speech**  
- Shows up every new session (login, reload, return after break)  

This feature makes MedPal feel like a warm companion, not just an app.

---

#  Tech Stack

### **Frontend**
- React  
- Vite  
- Tailwind CSS  
- Custom CSS Animations  
- Web Speech API (TTS)

### **Backend**
- Supabase  
  - Authentication  
  - Realtime Database  
  - Storage Buckets  

### **AI & Processing**
- Google Gemini & Agora AI (Chat + Emotion)  
- Custom OCR medicine parser pipeline  

---

# 🗂️ Supabase Database Schema

### **users**
| Column | Type | Notes |
|--------|------|--------|
| id | uuid | Primary key |
| name | text | User name |
| email | text | Login email |

### **prescriptions**
| Column | Type |
|--------|------|
| id | uuid |
| user_id | uuid |
| medicine_name | text |
| dosage | text |
| frequency | text |
| image_url | text |

### **reminders**
| Column | Type |
|--------|------|
| id | uuid |
| user_id | uuid |
| medicine_name | text |
| time | timestamp |
| status | text |

### **adherence_log**
| Column | Type |
|--------|------|
| id | uuid |
| user_id | uuid |
| date | date |
| taken_count | int |
| missed_count | int |

---



### 1️⃣ Clone Repository

git clone 

