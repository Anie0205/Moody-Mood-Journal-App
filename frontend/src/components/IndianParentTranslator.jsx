import { useState } from 'react'
import { translateForIndianParent } from '../lib/api'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function IndianParentTranslator() {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [translation, setTranslation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onTranslate = async () => {
    setError('')
    setTranslation('')
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await translateForIndianParent(text.trim())
      setTranslation(res.translation || '')
    } catch (e) {
      setError(e.message || 'Failed to translate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="card-lotus">
        <CardHeader>
                      <CardTitle className="lotus-gradient-text">Indian Parent Translator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <div className="text-center py-8">
                             <p className="text-[#5B3B89] mb-4">Please log in to access the Indian Parent Translator</p>
              <Link to="/login">
                                 <Button className="button-lotus">Login</Button>
              </Link>
            </div>
          ) : (
            <>
                             <p className="text-sm text-[#5B3B89]">
                Type what you want to say. The AI rephrases it in respectful, culturally sensitive Hinglish.
                Example: "I don't want to study engineering" → "Papa, main samajhta hoon engineering ki bahut izzat hoti hai, par mujhe lagta hai ki main kisi aur field mein zyada meaningful tareeke se contribute kar sakta hoon. Kya hum is par baat kar sakte hain?"
              </p>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What do you want to say?"
                className="min-h-32"
              />
              <Button onClick={onTranslate} disabled={loading} className="button-lotus">
                {loading ? 'Translating…' : 'Translate'}
              </Button>
              {error && <div className="text-sm text-red-600">{error}</div>}
              {translation && (
                <div className="p-4 rounded-md lotus-gradient-soft text-[#1E1E2F] whitespace-pre-wrap border border-[#3A8D8E]/20">
                  {translation}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


