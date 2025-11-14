const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY


export const chatWithGemini = async (message, context = {}) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: buildPrompt(message, context)
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          }
        })
      }
    )

    const data = await response.json()
    return data.candidates[0]?.content?.parts[0]?.text || 'I am here to help you.'
  } catch (error) {
    console.error('Gemini API error:', error)
    throw error
  }
}

function buildPrompt(message, context) {
  const { userName, language, reminders, emotion } = context

  let prompt = `You are MedPal, a caring AI health assistant for elderly patients in India.
User: ${userName || 'User'}
Language: ${language === 'hi' ? 'Respond in Hindi (Devanagari script)' : 'Respond in simple English'}
`

  if (emotion === 'confused') {
    prompt += '\nThe user seems confused. Respond very slowly, simply, and with extra care. Use short sentences.\n'
  }

  if (reminders && reminders.length > 0) {
    prompt += `\nCurrent medicines:\n${reminders.map(r => 
      `- ${r.medicine_name} at ${r.scheduled_time} (${r.status})`
    ).join('\n')}\n`
  }

  prompt += `\nBe warm, empathetic, and use very simple language. Address the user respectfully.
If asked about medicines, refer to the current medicines list above.
If asked to set a reminder, acknowledge and say you'll help them.
Keep responses short (2-3 sentences maximum).

User message: ${message}`

  return prompt
}

export const analyzeEmotion = async (text) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze the emotion in this text and respond with ONLY ONE WORD from: neutral, happy, confused, worried, frustrated, sad.

Text: "${text}"

Emotion:`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 10,
          }
        })
      }
    )

    const data = await response.json()
    const emotion = data.candidates[0]?.content?.parts[0]?.text.trim().toLowerCase()
    return ['neutral', 'happy', 'confused', 'worried', 'frustrated', 'sad'].includes(emotion) 
      ? emotion 
      : 'neutral'
  } catch (error) {
    console.error('Emotion analysis error:', error)
    return 'neutral'
  }
}
