import { useState, useEffect, useRef } from 'react'
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { chatWithGemini, analyzeEmotion } from '../services/geminiService'
import { speechService } from '../services/speechService'
import { supabase } from '../services/supabaseClient'

export default function ChatInterface({ userId, userName, language = 'en' }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reminders, setReminders] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadReminders()
    loadConversationHistory()
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadReminders = async () => {
    const { data } = await supabase
      .from('reminders')
      .select('medicine_name, scheduled_time, status')
      .eq('user_id', userId)
      .order('scheduled_time', { ascending: true })
      .limit(5)
    
    setReminders(data || [])
  }

  const loadConversationHistory = async () => {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(20)

    if (data) {
      setMessages(data.map(msg => ({
        text: msg.message,
        sender: msg.sender,
        emotion: msg.emotion,
        timestamp: msg.created_at
      })))
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message
    const newUserMessage = { text: userMessage, sender: 'user', timestamp: new Date() }
    setMessages(prev => [...prev, newUserMessage])

    try {
      // Analyze emotion
      const emotion = await analyzeEmotion(userMessage)

      // Get AI response
      const response = await chatWithGemini(userMessage, {
        userName,
        language,
        reminders,
        emotion
      })

      // Add AI response
      const aiMessage = { text: response, sender: 'assistant', timestamp: new Date() }
      setMessages(prev => [...prev, aiMessage])

      // Save to database
      await supabase.from('conversations').insert([
        { user_id: userId, message: userMessage, sender: 'user', emotion },
        { user_id: userId, message: response, sender: 'assistant' }
      ])

      // Speak response if enabled
      if (isSpeaking) {
        const lang = language === 'hi' ? 'hi-IN' : 'en-IN'
        await speechService.speak(response, lang)
      }

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = { 
        text: 'Sorry, I encountered an error. Please try again.', 
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening()
      setIsListening(false)
      return
    }

    const lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    speechService.initRecognition(lang)
    
    speechService.startListening(
      (transcript) => {
        setInput(transcript)
        setIsListening(false)
      },
      (error) => {
        console.error('Speech recognition error:', error)
        setIsListening(false)
      }
    )
    
    setIsListening(true)
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      speechService.stopSpeaking()
    }
    setIsSpeaking(!isSpeaking)
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Chat with MedPal</h2>
          <p className="text-sm text-gray-600">Your caring health companion</p>
        </div>
        <button
          onClick={toggleSpeaking}
          className={`p-2 rounded-lg transition-colors ${
            isSpeaking ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
          }`}
          title={isSpeaking ? 'Voice responses on' : 'Voice responses off'}
        >
          {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg mb-2">👋 Hello {userName}!</p>
            <p>I'm here to help you with your medicines.</p>
            <p className="text-sm mt-4">Try asking:</p>
            <div className="mt-2 space-y-1 text-sm">
              <p>"What's my next medicine?"</p>
              <p>"Have I taken my evening medicine?"</p>
              <p>"Remind me to take aspirin at 9 AM"</p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} message-enter`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.emotion && msg.emotion !== 'neutral' && (
                <span className="text-xs opacity-70 mt-1 block">
                  Emotion: {msg.emotion}
                </span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-lg transition-all ${
              isListening
                ? 'bg-red-500 text-white pulse-ring'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? 'Listening...' : 'Type your message...'}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            disabled={loading || isListening}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
