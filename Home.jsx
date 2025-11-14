import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Upload, Calendar, TrendingUp, Bell } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import ReminderCard from '../components/ReminderCard'
import HealthGreeter, { shouldShowGreeter, markVisit } from '../components/HealthGreeter'

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [todayReminders, setTodayReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGreeter, setShowGreeter] = useState(false)

  useEffect(() => {
    loadUserData()
    checkGreeter()
  }, [])

  const checkGreeter = () => {
    // Check if user just logged in (show greeter on every login)
    const justLoggedIn = sessionStorage.getItem('medpal_justLoggedIn') === 'true'
    
    // Check if greeter should be shown (either just logged in OR 2+ hours since last visit)
    if (justLoggedIn || shouldShowGreeter()) {
      setShowGreeter(true)
      // Clear the login flag after showing
      if (justLoggedIn) {
        sessionStorage.removeItem('medpal_justLoggedIn')
      }
    }
  }

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Load today's reminders
      const { data: reminders } = await supabase
        .from('reminders')
        .select('*, prescriptions(dosage, instructions)')
        .eq('user_id', user.id)
        .order('scheduled_time', { ascending: true })
        .limit(5)

      setTodayReminders(reminders || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReminderUpdate = (reminderId, status) => {
    setTodayReminders(prev =>
      prev.map(r => r.id === reminderId ? { ...r, status } : r)
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600"></div>
      </div>
    )
  }

  const handleGreeterClose = () => {
    setShowGreeter(false)
    markVisit() // Update last visit timestamp
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Health Greeter Modal */}
      {showGreeter && user && (
        <HealthGreeter
          userId={user.id}
          userName={user.email?.split('@')[0] || 'User'}
          onClose={handleGreeterClose}
        />
      )}

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600">
          Let's keep track of your health today
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => navigate('/chat')}
          className="card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors">
            <MessageCircle className="text-primary-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Chat with MedPal</h3>
          <p className="text-sm text-gray-600">Ask about your medicines</p>
        </button>

        <button
          onClick={() => navigate('/upload')}
          className="card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-secondary-200 transition-colors">
            <Upload className="text-secondary-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Upload Prescription</h3>
          <p className="text-sm text-gray-600">Add new medicines</p>
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">View Dashboard</h3>
          <p className="text-sm text-gray-600">Track your progress</p>
        </button>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center mb-3">
            <Calendar className="text-orange-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Today's Date</h3>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Today's Reminders */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Bell className="mr-2 text-primary-600" size={28} />
            Today's Reminders
          </h2>
          <span className="badge badge-warning">
            {todayReminders.filter(r => r.status === 'pending').length} Pending
          </span>
        </div>

        {todayReminders.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">No reminders for today</p>
            <button
              onClick={() => navigate('/upload')}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Upload size={18} />
              <span>Upload Prescription</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayReminders.map(reminder => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onStatusUpdate={handleReminderUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Health Tips */}
      <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Health Tip of the Day</h3>
        <p className="text-gray-700">
          Taking medicines at the same time every day helps your body maintain consistent levels 
          and improves treatment effectiveness. Set reminders and stick to your schedule!
        </p>
      </div>
    </div>
  )
}
