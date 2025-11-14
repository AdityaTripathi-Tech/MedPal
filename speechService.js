// Speech Recognition Service
export class SpeechService {
  constructor() {
    this.recognition = null
    this.synthesis = window.speechSynthesis
    this.isListening = false
  }

  // Initialize speech recognition
  initRecognition(language = 'en-IN') {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported')
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    this.recognition = new SpeechRecognition()
    this.recognition.continuous = false
    this.recognition.interimResults = false
    this.recognition.lang = language
  }

  // Start listening
  startListening(onResult, onError) {
    if (!this.recognition) {
      this.initRecognition()
    }

    this.isListening = true

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
      this.isListening = false
    }

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      onError(event.error)
      this.isListening = false
    }

    this.recognition.onend = () => {
      this.isListening = false
    }

    try {
      this.recognition.start()
    } catch (error) {
      console.error('Failed to start recognition:', error)
      this.isListening = false
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  // Text to speech
  speak(text, language = 'en-IN') {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language
      utterance.rate = 0.9 // Slightly slower for elderly users
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Get appropriate voice
      const voices = this.synthesis.getVoices()
      const voice = voices.find(v => v.lang.startsWith(language.split('-')[0]))
      if (voice) {
        utterance.voice = voice
      }

      utterance.onend = () => resolve()
      utterance.onerror = (error) => reject(error)

      this.synthesis.speak(utterance)
    })
  }

  // Stop speaking
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synthesis && this.synthesis.speaking
  }
}

export const speechService = new SpeechService()
