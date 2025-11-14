// Web Push Notification Service
export class NotificationService {
  constructor() {
    this.permission = Notification.permission
  }

  // Request notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    const permission = await Notification.requestPermission()
    this.permission = permission
    return permission === 'granted'
  }

  // Show notification
  showNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted')
      return null
    }

    const defaultOptions = {
      icon: '/medpal-icon.png',
      badge: '/medpal-badge.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      ...options
    }

    return new Notification(title, defaultOptions)
  }

  // Show medicine reminder notification
  showMedicineReminder(medicineName, dosage, instructions) {
    return this.showNotification('Medicine Reminder', {
      body: `Time to take ${medicineName}\nDosage: ${dosage}\n${instructions}`,
      tag: 'medicine-reminder',
      actions: [
        { action: 'taken', title: 'I\'ve taken it' },
        { action: 'snooze', title: 'Remind in 10 min' }
      ]
    })
  }

  // Schedule notification (using service worker)
  async scheduleNotification(time, data) {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      
      // Calculate delay
      const now = new Date()
      const scheduledTime = new Date(time)
      const delay = scheduledTime.getTime() - now.getTime()

      if (delay > 0) {
        setTimeout(() => {
          registration.showNotification(data.title, data.options)
        }, delay)
      }
    }
  }
}

export const notificationService = new NotificationService()

// Register service worker for push notifications
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js')
      console.log('Service Worker registered:', registration)
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  }
  return null
}
