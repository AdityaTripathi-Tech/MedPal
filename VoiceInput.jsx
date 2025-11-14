import { useState } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { speechService } from '../services/speechService'

export default function VoiceInput({ onTranscript, language = 'en-IN' }) {
  const [isListening, setIsListening] = useState(false)

  const handleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening()
      setIsListening(false)
      return
    }

    speechService.initRecognition(language)
    
    speechService.startListening(
      (transcript) => {
        onTranscript(transcript)
        setIsListening(false)
      },
      (error) => {
        console.error('Speech recognition error:', error)
        setIsListening(false)
      }
    )
    
    setIsListening(true)
  }

  return (
    <button
      onClick={handleVoiceInput}
      className={`p-4 rounded-full transition-all ${
        isListening
          ? 'bg-red-500 text-white pulse-ring shadow-lg'
          : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
      }`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
    </button>
  )
}
