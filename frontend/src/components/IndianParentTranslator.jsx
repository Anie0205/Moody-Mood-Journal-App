import { useState } from 'react'
import { translateForIndianParent } from '../lib/api'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { MessageCircle, Users, FileText, Brain, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function IndianParentTranslator() {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [translation, setTranslation] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onTranslate = async () => {
    setError('')
    setTranslation(null)
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await translateForIndianParent(text.trim())
      setTranslation(res)
    } catch (e) {
      setError(e.message || 'Failed to translate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className="card-lotus">
        <CardHeader>
          <CardTitle className="lotus-gradient-text flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Contextual Parent-Kid Communication Bridge
          </CardTitle>
          <p className="text-sm text-[#5B3B89] mt-2">
            Transform your feelings into clear, culturally-sensitive communication that bridges the gap between you and your parents.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!user ? (
            <div className="text-center py-8">
              <p className="text-[#5B3B89] mb-4">Please log in to access the Parent Communication Bridge</p>
              <Link to="/login">
                <Button className="button-lotus">Login</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#1E1E2F] mb-2 block">
                    What would you like to communicate to your parents?
                  </label>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Example: 'I'm feeling overwhelmed with school work and I need your support, but I don't know how to ask for it...'"
                    className="min-h-32 border-[#3A8D8E]/20 focus:border-[#3A8D8E] focus:ring-[#3A8D8E]"
                  />
                </div>
                
                <Button 
                  onClick={onTranslate} 
                  disabled={loading} 
                  className="button-lotus w-full"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span>Analyzing and translating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span>Generate Communication Bridge</span>
                    </div>
                  )}
                </Button>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Results Section */}
              {translation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Context Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-[#F2E7DA] to-[#ECE7E1] p-4 rounded-lg border border-[#3A8D8E]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-[#5B3B89]" />
                        <span className="text-sm font-medium text-[#1E1E2F]">Emotion Detected</span>
                      </div>
                      <p className="text-sm text-[#5B3B89] capitalize">{translation.emotion}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#F2E7DA] to-[#ECE7E1] p-4 rounded-lg border border-[#3A8D8E]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="h-4 w-4 text-[#5B3B89]" />
                        <span className="text-sm font-medium text-[#1E1E2F]">Communication Intent</span>
                      </div>
                      <p className="text-sm text-[#5B3B89] capitalize">{translation.intent.replace('_', ' ')}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#F2E7DA] to-[#ECE7E1] p-4 rounded-lg border border-[#3A8D8E]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-[#5B3B89]" />
                        <span className="text-sm font-medium text-[#1E1E2F]">Cultural Context</span>
                      </div>
                      <p className="text-sm text-[#5B3B89]">{translation.culturalContext}</p>
                    </div>
                  </div>

                  {/* Tabbed Results */}
                  <Tabs defaultValue="child" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="child" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Your Version
                      </TabsTrigger>
                      <TabsTrigger value="parent" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Parent Version
                      </TabsTrigger>
                      <TabsTrigger value="summary" className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Neutral Summary
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="child" className="mt-4">
                      <Card className="bg-gradient-to-br from-[#5B3B89] to-[#3A8D8E] text-white">
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-2">Clear Expression of Your Feelings</h3>
                          <p className="text-white/90 leading-relaxed">{translation.childVersion}</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="parent" className="mt-4">
                      <Card className="bg-gradient-to-br from-[#3A8D8E] to-[#E4A548] text-white">
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-2">Respectful Communication for Parents</h3>
                          <p className="text-white/90 leading-relaxed">{translation.parentVersion}</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="summary" className="mt-4">
                      <Card className="bg-gradient-to-br from-[#ECE7E1] to-[#F2E7DA] text-[#1E1E2F]">
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-2">Objective Understanding for Both</h3>
                          <p className="text-[#5B3B89] leading-relaxed">{translation.neutralSummary}</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      className="border-[#3A8D8E] text-[#3A8D8E] hover:bg-[#3A8D8E]/10"
                      onClick={() => {
                        navigator.clipboard.writeText(translation.parentVersion);
                      }}
                    >
                      Copy Parent Version
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-[#5B3B89] text-[#5B3B89] hover:bg-[#5B3B89]/10"
                      onClick={() => {
                        navigator.clipboard.writeText(translation.childVersion);
                      }}
                    >
                      Copy Your Version
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-[#E4A548] text-[#E4A548] hover:bg-[#E4A548]/10"
                      onClick={() => {
                        const fullText = `Child: ${translation.childVersion}\n\nParent: ${translation.parentVersion}\n\nSummary: ${translation.neutralSummary}`;
                        navigator.clipboard.writeText(fullText);
                      }}
                    >
                      Copy All
                    </Button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


