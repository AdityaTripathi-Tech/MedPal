import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import PrescriptionUpload from '../components/PrescriptionUpload'

export default function Upload() {
  const navigate = useNavigate()
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

  const handleUploadComplete = (result) => {
    setTimeout(() => {
      navigate('/')
    }, 3000)
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Prescription</h1>
        <p className="text-gray-600">Take a photo or upload an image of your doctor's prescription</p>
      </div>

      <PrescriptionUpload userId={user?.id} onUploadComplete={handleUploadComplete} />

      <div className="mt-8 card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-3">📸 Tips for Best Results:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Ensure good lighting when taking the photo</li>
          <li>• Keep the prescription flat and in focus</li>
          <li>• Make sure all text is clearly visible</li>
          <li>• Avoid shadows and glare on the paper</li>
          <li>• Capture the entire prescription in the frame</li>
        </ul>
      </div>
    </div>
  )
}
