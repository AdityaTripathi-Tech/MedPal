import { Clock, Check, X, Bell } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { speechService } from '../services/speechService'

export default function ReminderCard({ reminder, onStatusUpdate }) {
  const handleMarkTaken = async () => {
    try {
      const { error } = await supabase.functions.invoke('update-status', {
        body: {
          reminderId: reminder.id,
          status: 'done',
          userId: reminder.user_id
        }
      })

      if (error) throw error

      // Speak confirmation
      await speechService.speak('Great! I have marked it as taken.', 'en-IN')
      
      if (onStatusUpdate) {
        onStatusUpdate(reminder.id, 'done')
      }
    } catch (error) {
      console.error('Error updating reminder:', error)
    }
  }

  const handleMarkMissed = async () => {
    try {
      const { error } = await supabase.functions.invoke('update-status', {
        body: {
          reminderId: reminder.id,
          status: 'missed',
          userId: reminder.user_id
        }
      })

      if (error) throw error
      
      if (onStatusUpdate) {
        onStatusUpdate(reminder.id, 'missed')
      }
    } catch (error) {
      console.error('Error updating reminder:', error)
    }
  }

  const getStatusBadge = () => {
    switch (reminder.status) {
      case 'done':
        return <span className="badge badge-success">Taken</span>
      case 'missed':
        return <span className="badge badge-danger">Missed</span>
      default:
        return <span className="badge badge-warning">Pending</span>
    }
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Bell className="text-primary-600" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {reminder.medicine_name}
            </h3>
            {reminder.prescriptions && (
              <p className="text-sm text-gray-600 mt-1">
                {reminder.prescriptions.dosage}
              </p>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex items-center space-x-2 text-gray-600 mb-4">
        <Clock size={16} />
        <span className="text-sm font-medium">{reminder.scheduled_time}</span>
      </div>

      {reminder.prescriptions?.instructions && (
        <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
          📋 {reminder.prescriptions.instructions}
        </p>
      )}

      {reminder.status === 'pending' && (
        <div className="flex space-x-2">
          <button
            onClick={handleMarkTaken}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Check size={18} />
            <span>I've Taken It</span>
          </button>
          <button
            onClick={handleMarkMissed}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {reminder.taken_at && (
        <p className="text-xs text-gray-500 mt-2">
          Taken at {new Date(reminder.taken_at).toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
