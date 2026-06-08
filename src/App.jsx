import { useState } from 'react'
import { GoogleGenAI } from '@google/genai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
})

function App() {
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!jobDescription) {
      setError('Please describe the job first')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `You are an expert estimator for home services and trades businesses.
        Generate a professional itemized quote based on this job description.
        Include labor, materials, and a total. Keep it concise and professional.
        Use only standard markdown — no HTML tags like <br> in your response.
        
        Job Description: ${jobDescription}`
      })

      setResult(response.text)

    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>AI Quote Generator</h1>
        <p>Built for trades businesses — powered by AI</p>
      </div>

      <div className="card">
        <label className="label">Describe the job</label>
        <textarea
          className="textarea"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="e.g. Replace gutters on a 2-story house, approximately 150 feet"
          rows={4}
        />

        <button
          className="button"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Quote'}
        </button>

        {error && <p className="error">{error}</p>}
      </div>

      {result && (
        <div className="result-card">
          <h3>Your Quote</h3>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {result}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default App