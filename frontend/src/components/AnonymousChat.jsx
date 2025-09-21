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
      console.log('Sending message:', { text, conversationHistory })
      const res = await sendAnonymousMessage(text, conversationHistory)
      console.log('Response received:', res)
      
      // Handle crisis response
      if (res.crisis) {
        setMessages(prev => [...prev, { 
          role: 'crisis', 
          text: res.message,
          emergencyResources: res.emergencyResources,
          aiResponse: res.aiResponse
        }])
      } else {
        const reply = res.reply || ''
        setMessages(prev => [...prev, { role: 'ai', text: reply }])
      }
    } catch (e) {
      console.error('Error details:', e)
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
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mt-3">
            <p className="text-blue-800 text-sm">
              <strong>Important:</strong> This is a reflective journaling aid, not therapy or medical advice. 
              If you're having thoughts of self-harm, please reach out to a trusted adult or call a helpline immediately.
            </p>
          </div>
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
                  {m.role === 'crisis' ? (
                    <div className="max-w-[90%] w-full">
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="font-semibold text-red-700">Safety Alert</span>
                        </div>
                        <p className="text-red-800 mb-4">{m.text}</p>
                        
                        {m.emergencyResources && (
                          <div className="space-y-3">
                            <div className="bg-white p-3 rounded-lg border border-red-200">
                              <h4 className="font-semibold text-red-700 mb-2">Emergency Helplines (24/7):</h4>
                              <div className="space-y-2">
                                {m.emergencyResources.helplines.map((helpline, idx) => (
                                  <div key={idx} className="flex justify-between items-center">
                                    <div>
                                      <span className="font-medium text-gray-800">{helpline.name}</span>
                                      <p className="text-sm text-gray-600">{helpline.description}</p>
                                    </div>
                                    <a 
                                      href={`tel:${helpline.number}`}
                                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                    >
                                      Call {helpline.number}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                              <p className="text-yellow-800 text-sm">
                                <strong>Emergency:</strong> {m.emergencyResources.emergency}
                              </p>
                            </div>
                            
                            {m.emergencyResources.onlineResources && (
                              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                <h5 className="font-semibold text-blue-700 mb-2">Additional Resources:</h5>
                                <ul className="text-blue-800 text-sm space-y-1">
                                  {m.emergencyResources.onlineResources.map((resource, idx) => (
                                    <li key={idx}>• {resource}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 text-sm italic">{m.aiResponse}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`${m.role === 'user' ? 'bg-gradient-to-br from-[#5B3B89] to-[#3A8D8E] text-white' : 'bg-gradient-to-br from-[#F2E7DA] to-[#ECE7E1] text-[#1E1E2F]'} max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${m.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                      {m.text}
                    </div>
                  )}
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