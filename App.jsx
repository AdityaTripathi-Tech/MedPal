import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './services/supabaseClient'

// Pages
import Home from './pages/Home'
import Chat from './pages/Chat'
import Upload from './pages/Upload'
import FamilyDashboard from './pages/FamilyDashboard'
import Login from './pages/Login'

// Components
import Navbar from './components/Navbar'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let initialSessionSet = false
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      initialSessionSet = true
      
      // If there's a session on initial load and no existing flag, 
      // check if we should show greeter (handled by shouldShowGreeter in Home)
      // We don't set justLoggedIn here to avoid showing on every page refresh
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      // Mark that user just logged in (for HealthGreeter)
      // Only set flag on actual SIGNED_IN event, not on initial load
      if (event === 'SIGNED_IN' && session && initialSessionSet) {
        sessionStorage.setItem('medpal_justLoggedIn', 'true')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading MedPal...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {session && <Navbar />}
        <Routes>
          <Route 
            path="/login" 
            element={!session ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={session ? <Home /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/chat" 
            element={session ? <Chat /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/upload" 
            element={session ? <Upload /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={session ? <FamilyDashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
