// App Constants

export const APP_NAME = 'MedPal'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Your Conversational Health Companion'

// Languages
export const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
}

export const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
}

// Reminder Status
export const REMINDER_STATUS = {
  PENDING: 'pending',
  DONE: 'done',
  MISSED: 'missed',
}

// Emotions
export const EMOTIONS = {
  NEUTRAL: 'neutral',
  HAPPY: 'happy',
  CONFUSED: 'confused',
  WORRIED: 'worried',
  FRUSTRATED: 'frustrated',
  SAD: 'sad',
}

// Medicine Frequencies
export const FREQUENCIES = {
  ONCE_DAILY: 'once daily',
  TWICE_DAILY: 'twice daily',
  THRICE_DAILY: 'thrice daily',
  FOUR_TIMES_DAILY: 'four times daily',
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  NIGHT: 'night',
}

// Time Slots
export const TIME_SLOTS = {
  MORNING: '08:00:00',
  AFTERNOON: '14:00:00',
  EVENING: '18:00:00',
  NIGHT: '21:00:00',
}

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#0ea5e9',
  SUCCESS: '#10b981',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
}

// API Endpoints
export const API_ENDPOINTS = {
  PROCESS_PRESCRIPTION: '/functions/v1/process-prescription',
  SEND_REMINDER: '/functions/v1/send-reminder',
  CHAT_GEMINI: '/functions/v1/chat-gemini',
  UPDATE_STATUS: '/functions/v1/update-status',
  GET_DASHBOARD: '/functions/v1/get-dashboard-data',
  ANALYZE_EMOTION: '/functions/v1/analyze-emotion',
}

// Storage Buckets
export const STORAGE_BUCKETS = {
  PRESCRIPTIONS: 'prescriptions',
}

// Max File Size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024

// Supported Image Formats
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

// Date Formats
export const DATE_FORMATS = {
  FULL: 'MMMM dd, yyyy',
  SHORT: 'MMM dd',
  TIME: 'hh:mm a',
  DATETIME: 'MMM dd, yyyy hh:mm a',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  LANGUAGE: 'medpal_language',
  VOICE_ENABLED: 'medpal_voice_enabled',
  THEME: 'medpal_theme',
}
