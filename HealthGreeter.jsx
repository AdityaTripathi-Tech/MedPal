import { useState, useEffect } from 'react'
import { X, Volume2, VolumeX } from 'lucide-react'
import { chatWithGemini } from '../services/geminiService'
import { speechService } from '../services/speechService'

const LAST_VISIT_KEY = 'medpal_lastVisit'
const GREETING_INTERVAL_HOURS = 2

export default function HealthGreeter({ userId, userName, onClose }) {
  const [greeting, setGreeting] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    generateGreeting()
  }, [userId, userName])

  useEffect(() => {
    // Trigger animation after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const generateGreeting = async () => {
    try {
      setLoading(true)
      const prompt = `Greet the user warmly, address them respectfully by name, ask how they are feeling today, and speak in a caring tone. Keep it brief (2-3 sentences maximum). Be empathetic and friendly.`
      
      const context = {
        userName: userName || 'User',
        language: 'en'
      }

      const response = await chatWithGemini(prompt, context)
      setGreeting(response)
      
      // Auto-speak the greeting
      if ('speechSynthesis' in window) {
        setIsSpeaking(true)
        await speechService.speak(response, 'en-IN')
        setIsSpeaking(false)
      }
    } catch (error) {
      console.error('Error generating greeting:', error)
      setGreeting(`Hello ${userName || 'there'}! How are you feeling today? I'm here to help you with your health.`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Update lastVisit timestamp
    localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString())
    setIsVisible(false)
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const handleSpeak = async () => {
    if (isSpeaking) {
      speechService.stopSpeaking()
      setIsSpeaking(false)
    } else if (greeting) {
      setIsSpeaking(true)
      await speechService.speak(greeting, 'en-IN')
      setIsSpeaking(false)
    }
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Robot Avatar */}
        <div className="flex flex-col items-center mb-4">
          <div className="robot-avatar mb-4">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="robot-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Robot Head */}
              <rect
                x="30"
                y="20"
                width="60"
                height="50"
                rx="8"
                fill="#4F46E5"
                className="robot-head"
              />
              
              {/* Eyes */}
              <circle
                cx="45"
                cy="40"
                r="6"
                fill="#FFFFFF"
                className="robot-eye robot-eye-left"
              />
              <circle
                cx="75"
                cy="40"
                r="6"
                fill="#FFFFFF"
                className="robot-eye robot-eye-right"
              />
              
              {/* Eye pupils */}
              <circle cx="45" cy="40" r="3" fill="#1E1B4B" />
              <circle cx="75" cy="40" r="3" fill="#1E1B4B" />
              
              {/* Antenna */}
              <rect x="57" y="10" width="6" height="12" rx="3" fill="#6366F1" />
              <circle cx="60" cy="10" r="4" fill="#FBBF24" />
              
              {/* Mouth */}
              <path
                d="M 45 55 Q 60 60 75 55"
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Robot Body */}
              <rect
                x="35"
                y="70"
                width="50"
                height="40"
                rx="6"
                fill="#6366F1"
                className="robot-body"
              />
              
              {/* Chest Panel */}
              <rect
                x="45"
                y="80"
                width="30"
                height="20"
                rx="4"
                fill="#818CF8"
              />
              
              {/* Arms (waving) */}
              <rect
                x="20"
                y="75"
                width="12"
                height="25"
                rx="6"
                fill="#4F46E5"
                className="robot-arm robot-arm-left"
              />
              <rect
                x="88"
                y="75"
                width="12"
                height="25"
                rx="6"
                fill="#4F46E5"
                className="robot-arm robot-arm-right"
              />
              
              {/* Hands */}
              <circle cx="26" cy="100" r="5" fill="#1E1B4B" />
              <circle cx="94" cy="100" r="5" fill="#1E1B4B" />
            </svg>
          </div>
        </div>

        {/* Greeting Message */}
        <div className="text-center mb-4">
          {loading ? (
            <div className="flex items-center justify-center space-x-2 py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="text-gray-600">MedPal is thinking...</span>
            </div>
          ) : (
            <p className="text-gray-800 text-lg leading-relaxed">
              {greeting}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          {greeting && (
            <button
              onClick={handleSpeak}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isSpeaking
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
              aria-label={isSpeaking ? 'Stop speaking' : 'Speak greeting'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={18} />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 size={18} />
                  <span>Listen</span>
                </>
              )}
            </button>
          )}
          
          <button
            onClick={handleClose}
            className="btn-primary px-6 py-2"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

// Export utility function to check if greeter should show
export function shouldShowGreeter() {
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY)
  
  if (!lastVisit) {
    return true // First visit
  }
  
  const lastVisitTime = new Date(lastVisit).getTime()
  const now = new Date().getTime()
  const hoursSinceLastVisit = (now - lastVisitTime) / (1000 * 60 * 60)
  
  return hoursSinceLastVisit >= GREETING_INTERVAL_HOURS
}

// Export function to mark visit
export function markVisit() {
  localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString())
}

