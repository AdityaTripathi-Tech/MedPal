# API Documentation - Prescription Reader Endpoint

## Endpoint: POST /prescription

Analyzes a medicine prescription image using OpenAI Vision API and extracts structured medicine data.

### Request

```http
POST http://localhost:3001/prescription
Content-Type: application/json

{
  "sessionId": "session-abc123",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | No | Session ID for conversation history (default: "default") |
| `imageBase64` | string | Yes | Base64-encoded image as data URL or HTTPS URL |

### Response (Success)

```json
{
  "prescription": {
    "patientName": "John Doe",
    "date": "November 14, 2025",
    "doctor": "Dr. Sarah Johnson",
    "medications": [
      {
        "name": "Metformin",
        "dosage": "500mg",
        "frequency": "Twice daily",
        "duration": "3 months"
      },
      {
        "name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "Once daily",
        "duration": "Ongoing"
      }
    ]
  }
}
```

### Response (If parsing unclear)

```json
{
  "prescription": {
    "raw": "Unable to parse structure, but text found: [raw OCR text here]"
  }
}
```

### Response (Error)

```json
{
  "error": "imageBase64 required"
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Successfully analyzed prescription |
| 400 | Missing `imageBase64` parameter |
| 500 | API error (check server logs) |

## Frontend Integration Example

### React Component

```jsx
import React, { useState } from 'react'
import axios from 'axios'

export default function PrescriptionReader() {
  const [image, setImage] = useState(null)
  const [prescription, setPrescription] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  const analyze = async () => {
    if (!image) return
    
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:3001/prescription', {
        sessionId: 'my-session-123',
        imageBase64: image
      })
      setPrescription(res.data.prescription)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <button onClick={analyze} disabled={!image || loading}>
        {loading ? 'Analyzing...' : 'Read Prescription'}
      </button>

      {prescription && (
        <div>
          <p>Patient: {prescription.patientName}</p>
          <p>Doctor: {prescription.doctor}</p>
          <p>Date: {prescription.date}</p>
          
          <h3>Medications:</h3>
          <ul>
            {prescription.medications?.map((med, i) => (
              <li key={i}>
                {med.name} - {med.dosage}
                <br />
                {med.frequency} for {med.duration}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

### JavaScript/Fetch Example

```javascript
async function readPrescription(imageBase64) {
  const response = await fetch('http://localhost:3001/prescription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'my-session',
      imageBase64: imageBase64
    })
  })

  const data = await response.json()
  
  if (response.ok) {
    console.log('Prescription:', data.prescription)
    displayPrescription(data.prescription)
  } else {
    console.error('Error:', data.error)
  }
}
```

## Backend Configuration

### Required Environment Variables

```env
# Your OpenAI API key with GPT-4 Vision access
OPENAI_API_KEY=sk-...

# Optional: Server port (default: 3001)
PORT=3001
```

### Required NPM Packages

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "openai": "^4.9.0",
    "express-fileupload": "^1.4.0"
  }
}
```

### Model Configuration

The endpoint uses **GPT-4 Vision** from OpenAI:
- Model: `gpt-4-vision-preview` or `gpt-4` (with vision)
- Vision capability allows analyzing images
- Typical response time: 1-3 seconds

## Implementation Notes

### Image Format Support

✅ Supported:
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- WebP (`.webp`)
- GIF (`.gif`)
- Data URLs (`data:image/...;base64,...`)
- HTTPS URLs

❌ Not supported:
- Extremely small images (< 100x100 px)
- Very large files (> 20MB)

### Accuracy Considerations

The prescription reading accuracy depends on:
- **Image quality** - Clear, well-lit images work best
- **Text clarity** - Handwritten prescriptions may be less accurate
- **Language** - Currently optimized for English prescriptions
- **Format** - Standard prescription formats work better

### Rate Limiting Recommendation

For production, implement rate limiting:

```javascript
const rateLimit = require('express-rate-limit')

const prescriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many prescription requests'
})

app.post('/prescription', prescriptionLimiter, (req, res) => {
  // ... handle prescription
})
```

## Troubleshooting

### "Failed to fetch" or CORS error
- Ensure backend is running: `npm run dev` in server folder
- Check CORS is enabled (it is by default)
- Verify URL matches your server: `http://localhost:3001`

### "Model not found" error
- Check `OPENAI_API_KEY` is set in `.env`
- Verify your OpenAI account has GPT-4 Vision access
- Try a different model if needed

### Image not processing / Unclear response
- Try a different/clearer prescription image
- Check image format (JPEG/PNG work best)
- Review server logs for detailed errors

### Rate limit exceeded
- Wait 15 minutes before next request (if rate limiting is implemented)
- Check server configuration

## Extending the Feature

### Add Drug Interaction Warnings

```javascript
// After reading prescription, cross-check medications
const interactions = checkDrugInteractions(medications)
```

### Add Pharmacy Integration

```javascript
// After reading, fetch from pharmacy APIs
const pharmacies = await findNearbyPharmacies(medications)
```

### Add Prescription History

```javascript
// Store in database
await database.prescriptions.save({
  userId,
  image: imageBase64,
  data: prescription,
  timestamp: new Date()
})
```

### Multi-Language Support

```javascript
// Modify system prompt to support other languages
"Please analyze this prescription and return results in Spanish..."
```
