import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import ChatInterface from '../components/ChatInterface'

export default function Chat() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-[calc(100vh-12rem)]">
        <ChatInterface 
          userId={user?.id} 
          userName={user?.email?.split('@')[0] || 'User'}
          language="en"
        />
      </div>
    </div>
  )
}
