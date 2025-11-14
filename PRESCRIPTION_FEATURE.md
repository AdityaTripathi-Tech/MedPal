# Medicine Prescription Reader Feature

This chatbot now includes a **prescription image reader** that uses AI vision to extract medicine details from prescription images.

## Features

- **Image Upload**: Upload a photo of your medicine prescription
- **OCR & Parsing**: AI analyzes the image and extracts:
  - Patient name
  - Prescription date
  - Prescribing doctor
  - All medicines with dosage, frequency, and duration
- **Multi-format Support**: Works with JPG, PNG, and other image formats
- **Text-to-Speech**: Automatically reads out the extracted prescription details

## How to Use

### Demo Mode (demo.html)

1. Open `demo.html` in your browser
2. Click the **📤 Upload Image** button in the "💊 Prescription" section
3. Select a prescription image from your device
4. Click **🔍 Read Prescription** button
5. The AI will analyze and display the prescription details
6. Click **🔊 Play Last Reply** to hear it read aloud

### Full-Stack App (with Node.js)

1. Ensure your server is running (see main README)
2. In the React frontend:
   - Use the file input to upload a prescription image
   - Click **🔍 Read Prescription**
3. The server sends the image to OpenAI's Vision API and returns parsed data

## Backend Setup (for production)

The backend endpoint for prescription reading is:

```
POST /prescription
Body: {
  "sessionId": "session-id",
  "imageBase64": "data:image/jpeg;base64,..."
}

Response: {
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
      ...
    ]
  }
}
```

## Requirements

For the full-stack app to work with real prescriptions:

1. **OpenAI API Key** with GPT-4 Vision capability
   - Set `OPENAI_API_KEY` in your server `.env`
   - The backend uses `gpt-4-vision-preview` or `gpt-4` with vision
2. **Node.js dependencies** (already in package.json):
   - `express-fileupload` for file handling

## Model Notes

- The demo uses **simulated prescription parsing** (mock data)
- The full-stack app uses **GPT-4 Vision** from OpenAI (requires API key)
- GPT-4 Vision can accurately read handwritten and printed prescriptions
- Response time: typically 1-3 seconds per image

## Privacy & Security

- Demo mode processes images entirely in-browser (no server upload)
- Full-stack mode: images are sent to OpenAI API for analysis
- **Recommendation**: For production, implement:
  - Encryption for image transmission
  - Audit logging for HIPAA compliance
  - Rate limiting on prescription endpoint
  - User authentication

## Example Workflow

```
User → Uploads prescription image
    ↓
Frontend → Sends image to server /prescription endpoint
    ↓
Backend → Calls OpenAI Vision API
    ↓
OpenAI → Analyzes image and extracts data
    ↓
Backend → Returns structured JSON with medicine details
    ↓
Frontend → Displays prescription info and reads it aloud
```

## Troubleshooting

**"Model not found" error**
- Ensure your OpenAI account has access to GPT-4 Vision
- Check that `OPENAI_API_KEY` is set correctly

**Image not processing**
- Try a clearer, well-lit prescription image
- Ensure the image is in JPG or PNG format
- Check server logs for API errors

**Audio not playing**
- Ensure your browser has speakers enabled
- Check browser permissions for audio output
- Try the "🔊 Play Last Reply" button manually

## Future Enhancements

- [ ] Multi-language prescription support
- [ ] Drug interaction warnings
- [ ] Pharmacy integration
- [ ] Prescription history tracking
- [ ] Medicine reminder notifications
- [ ] Insurance coverage lookup
