import { useState } from 'react'
import { Upload, Camera, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../services/supabaseClient'

export default function PrescriptionUpload({ userId, onUploadComplete }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setError(null)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(fileName)

      setUploading(false)
      setProcessing(true)

      // Call Edge Function to process prescription
      const { data, error: processError } = await supabase.functions.invoke(
        'process-prescription',
        {
          body: { imageUrl: publicUrl, userId }
        }
      )

      if (processError) throw processError

      setProcessing(false)
      setResult(data)
      
      if (onUploadComplete) {
        onUploadComplete(data)
      }

    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload prescription')
      setUploading(false)
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="text-primary-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Prescription</h2>
        <p className="text-gray-600">Take a photo or upload an image of your prescription</p>
      </div>

      {!preview && !result && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="text-gray-400 mb-4" size={48} />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
          </label>
        </div>
      )}

      {preview && !result && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="Prescription preview"
              className="w-full rounded-lg shadow-md"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleUpload}
              disabled={uploading || processing}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              {uploading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              {processing && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <span>
                {uploading ? 'Uploading...' : processing ? 'Processing...' : 'Process Prescription'}
              </span>
            </button>
            <button
              onClick={handleReset}
              disabled={uploading || processing}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {result && result.success && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium text-green-800">Success!</p>
              <p className="text-sm text-green-600">
                Prescription processed successfully. {result.prescriptions?.length || 0} medicine(s) added.
              </p>
            </div>
          </div>

          {result.prescriptions && result.prescriptions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Extracted Medicines:</h3>
              {result.prescriptions.map((med, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{med.medicine_name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Dosage:</span> {med.dosage}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Frequency:</span> {med.frequency}
                      </p>
                      {med.instructions && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Instructions:</span> {med.instructions}
                        </p>
                      )}
                    </div>
                    <span className="badge badge-success">Added</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.extractedText && (
            <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <summary className="cursor-pointer font-medium text-gray-700">
                View Extracted Text
              </summary>
              <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap">
                {result.extractedText}
              </pre>
            </details>
          )}

          <button
            onClick={handleReset}
            className="w-full btn-secondary"
          >
            Upload Another Prescription
          </button>
        </div>
      )}
    </div>
  )
}
