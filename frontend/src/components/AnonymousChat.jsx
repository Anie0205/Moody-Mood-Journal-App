import { useState } from 'react'
import { sendAnonymousMessage } from '../lib/api'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnonymousChat() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSend = async () => {
    setError('')
    setReply('')
    if (!message.trim()) return
    setLoading(true)
    try {
      const res = await sendAnonymousMessage(message.trim())
      setReply(res.reply || '')
    } catch (e) {
      setError(e.message || 'Failed to send')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="card-lotus">
        <CardHeader>
                      <CardTitle className="lotus-gradient-text">Anonymous, Judgment-Free Conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
                     <p className="text-sm text-[#5B3B89]">
            Talk freely without signup. Great for stress release, reflection, and stigma-free venting.
            Limitations: This is not a replacement for therapy and cannot handle emergencies.
          </p>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type what’s on your mind..."
            className="min-h-32"
          />
          <div className="flex items-center gap-2">
                      <Button onClick={onSend} disabled={loading} className="button-lotus">
            {loading ? 'Thinking…' : 'Send'}
          </Button>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {reply && (
            <div className="p-4 rounded-md lotus-gradient-soft text-[#1E1E2F] whitespace-pre-wrap border border-[#3A8D8E]/20">
              {reply}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


