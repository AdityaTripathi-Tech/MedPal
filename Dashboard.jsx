import { useEffect, useState } from 'react'
import { Activity, Pill, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import AdherenceChart from './AdherenceChart'

export default function Dashboard({ userId }) {
  const [stats, setStats] = useState(null)
  const [adherenceData, setAdherenceData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [userId])

  const loadDashboardData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-dashboard-data', {
        body: { userId }
      })

      if (error) throw error

      setStats(data.stats)
      setAdherenceData(data.adherenceData)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Adherence Rate</p>
              <p className="text-3xl font-bold mt-1">{stats?.adherenceRate || 0}%</p>
            </div>
            <Activity size={40} className="text-primary-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Doses Taken</p>
              <p className="text-3xl font-bold mt-1">{stats?.totalTaken || 0}</p>
            </div>
            <CheckCircle size={40} className="text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Doses Missed</p>
              <p className="text-3xl font-bold mt-1">{stats?.totalMissed || 0}</p>
            </div>
            <XCircle size={40} className="text-red-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Active Medicines</p>
              <p className="text-3xl font-bold mt-1">{stats?.activeMedicines || 0}</p>
            </div>
            <Pill size={40} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdherenceChart data={adherenceData} type="line" />
        <AdherenceChart data={adherenceData} type="bar" />
      </div>
    </div>
  )
}
