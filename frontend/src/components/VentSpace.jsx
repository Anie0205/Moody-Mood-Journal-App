import { useEffect, useState } from 'react'
import { createVentEntry, listVentEntries } from '../lib/api'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function VentSpace() {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [reply, setReply] = useState('')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await listVentEntries()
      setEntries(res || [])
    } catch (_) {
      // ignore if not logged in
    }
  }

  useEffect(() => {
    if (user) {
      load()
    }
  }, [user])

  const onCreate = async () => {
    setError('')
    setReply('')
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await createVentEntry({ text: text.trim() })
      setReply(res.reply || '')
      setText('')
      await load()
    } catch (e) {
      setError(e.message || 'Failed to save vent')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Card className="card-lotus">
        <CardHeader>
          <CardTitle className="lotus-gradient-text">Vent Space</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <div className="text-center py-8">
                             <p className="text-[#5B3B89] mb-4">Please log in to access Vent Space</p>
              <Link to="/login">
                                 <Button className="button-lotus">Login</Button>
              </Link>
            </div>
          ) : (
            <>
                             <p className="text-sm text-[#5B3B89]">
                Rant privately. Your vents are stored securely and only visible to you.
              </p>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Let it out…"
                className="min-h-32"
              />
              <Button onClick={onCreate} disabled={loading} className="button-lotus">
                {loading ? 'Saving…' : 'Save & Get Support'}
              </Button>
              {error && <div className="text-sm text-red-600">{error}</div>}
                        {reply && (
            <div className="p-4 rounded-md lotus-gradient-soft text-[#1E1E2F] whitespace-pre-wrap border border-[#3A8D8E]/20">
              {reply}
            </div>
          )}
            </>
          )}
        </CardContent>
      </Card>

      {user && entries?.length > 0 && (
        <Card className="card-lotus">
          <CardHeader>
                          <CardTitle className="lotus-gradient-text">Your Vents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.map((e) => (
                             <div key={e.id} className="p-3 rounded-md border border-[#3A8D8E]/20 bg-white/80 backdrop-blur-sm">
                                 <div className="text-xs text-[#5B3B89] mb-2">{new Date(e.createdAt).toLocaleString()}</div>
                 <div className="whitespace-pre-wrap text-[#1E1E2F]">{e.text}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}


