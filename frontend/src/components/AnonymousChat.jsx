import { useEffect, useRef, useState } from 'react'
import { sendAnonymousMessage } from '../lib/api'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Sparkles } from 'lucide-react'

export default function AnonymousChat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([]) // {role: 'user'|'ai', text}
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)

  const onSend = async () => {
    setError('')
    const text = message.trim()
    if (!text) return
    setMessage('')
    setMessages(prev => [...prev, { role: 'user', text }])
    setLoading(true)
    try {
      // Send conversation history for context-aware responses
      const conversationHistory = [...messages, { role: 'user', text }]
      const res = await sendAnonymousMessage(text, conversationHistory)
      const reply = res.reply || ''
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    } catch (e) {
      setError(e.message || 'Failed to send')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, loading])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Card className="card-lotus">
        <CardHeader>
          <CardTitle className="lotus-gradient-text flex items-center gap-2">
            <MessageCircle className="h-5 w-5" /> Anonymous, Judgment-Free Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[480px] bg-white/70 rounded-2xl border border-[#3A8D8E]/20 overflow-hidden">
            <div ref={listRef} className="h-[420px] overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-[#5B3B89] text-sm mt-24">
                  Start a conversation. Your messages are anonymous and moderated for safety.
                </div>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${m.role === 'user' ? 'bg-gradient-to-br from-[#5B3B89] to-[#3A8D8E] text-white' : 'bg-gradient-to-br from-[#F2E7DA] to-[#ECE7E1] text-[#1E1E2F]'} max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${m.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-[#F2E7DA] to-[#ECE7E1] text-[#1E1E2F] max-w-[75%] px-4 py-2 rounded-2xl rounded-bl-md shadow-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#5B3B89]" />
                    <span>Typing…</span>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-[#3A8D8E]/20 p-3 flex items-center gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message…"
                className="min-h-10 h-10 flex-1 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
              />
              <Button onClick={onSend} disabled={loading} className="button-lotus px-5">
                {loading ? 'Sending…' : 'Send'}
              </Button>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
        </CardContent>
      </Card>
    </div>
  )
}