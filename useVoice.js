import { useState, useCallback } from 'react'
import { speechService } from '../services/speechService'

export function useVoice(language = 'en-IN') {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)

  const startListening = useCallback(() => {
    try {
      speechService.initRecognition(language)
      speechService.startListening(
        (text) => {
          setTranscript(text)
          setIsListening(false)
        },
        (err) => {
          setError(err)
          setIsListening(false)
        }
      )
      setIsListening(true)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }, [language])

  const stopListening = useCallback(() => {
    speechService.stopListening()
    setIsListening(false)
  }, [])

  const speak = useCallback(async (text) => {
    try {
      setIsSpeaking(true)
      setError(null)
      await speechService.speak(text, language)
      setIsSpeaking(false)
    } catch (err) {
      setError(err.message)
      setIsSpeaking(false)
    }
  }, [language])

  const stopSpeaking = useCallback(() => {
    speechService.stopSpeaking()
    setIsSpeaking(false)
  }, [])

  return {
    isListening,
    isSpeaking,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  }
}
