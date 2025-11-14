import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export function useReminders(userId) {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    loadReminders()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('reminders_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'reminders',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          console.log('Reminder changed:', payload)
          loadReminders()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  const loadReminders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reminders')
        .select('*, prescriptions(dosage, instructions)')
        .eq('user_id', userId)
        .order('scheduled_time', { ascending: true })

      if (error) throw error
      setReminders(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateReminderStatus = async (reminderId, status) => {
    try {
      const { error } = await supabase.functions.invoke('update-status', {
        body: { reminderId, status, userId }
      })

      if (error) throw error
      await loadReminders()
    } catch (err) {
      setError(err.message)
    }
  }

  return { reminders, loading, error, updateReminderStatus, refetch: loadReminders }
}
