import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import Dashboard from '../components/Dashboard'
import { Users, Heart, AlertTriangle } from 'lucide-react'

export default function FamilyDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: conversations } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentActivity(conversations || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <Users className="mr-3 text-primary-600" size={32} />
          Family Dashboard
        </h1>
        <p className="text-gray-600">Monitor health adherence and activity</p>
      </div>

      <Dashboard userId={user?.id} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="mr-2 text-red-500" size={20} />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.sender === 'user' ? 'bg-primary-500' : 'bg-gray-400'}`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-yellow-600" size={20} />
            Health Alerts
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-yellow-200">
              <p className="text-sm font-medium text-gray-800">All medicines taken on time today! 🎉</p>
              <p className="text-xs text-gray-600 mt-1">Keep up the great work!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
