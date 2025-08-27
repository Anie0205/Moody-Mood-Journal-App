import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiGet, apiPost, apiDelete } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, TrendingUp, Flower2, Smile, Frown, Meh, Plus, Trash2, BookOpen, Heart, Angry, AlertCircle, Moon, Leaf, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

const Dashboard = () => {
  const { user } = useAuth()
  const [moods, setMoods] = useState([])
  const [selectedMood, setSelectedMood] = useState('')
  const [moodNote, setMoodNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Lotus-inspired palette: magenta, soft purples, creamy whites, golden center, muted teals/greens
  const moodOptions = [
    // Palette: Teal #3A8D8E, Deep Purple #5B3B89, Golden #E4A548, Beige #F2E7DA/#ECE7E1
    { icon: Smile, label: 'Happy', value: 'happy', color: 'from-[#E4A548] to-[#ECE7E1]' },
    { icon: Frown, label: 'Sad', value: 'sad', color: 'from-[#5B3B89] to-[#3A8D8E]' },
    { icon: Angry, label: 'Angry', value: 'angry', color: 'from-[#E4A548] to-[#5B3B89]' },
    { icon: AlertCircle, label: 'Anxious', value: 'anxious', color: 'from-[#3A8D8E] to-[#5B3B89]' },
    { icon: Moon, label: 'Tired', value: 'tired', color: 'from-[#ECE7E1] to-[#5B3B89]' },
    { icon: Leaf, label: 'Calm', value: 'calm', color: 'from-[#3A8D8E] to-[#ECE7E1]' },
    { icon: Sun, label: 'Excited', value: 'excited', color: 'from-[#5B3B89] to-[#E4A548]' },
    { icon: Meh, label: 'Neutral', value: 'neutral', color: 'from-[#ECE7E1] to-[#3A8D8E]' }
  ]

  useEffect(() => {
    fetchMoods()
  }, [])

  const fetchMoods = async () => {
    try {
      const data = await apiGet('/api/moods')
      // Backend returns an array of mood entries directly
      if (Array.isArray(data)) {
        setMoods(data)
      }
    } catch (error) {
      console.error('Error fetching moods:', error)
    }
  }

  const handleMoodSubmit = async () => {
    if (!selectedMood) {
      setError('Please select a mood')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await apiPost('/api/moods', { mood: selectedMood, note: moodNote })
      setSuccess('Mood logged successfully!')
      setSelectedMood('')
      setMoodNote('')
      fetchMoods()
    } catch (error) {
      setError(error.message || 'Failed to log mood. Please try again.')
    }

    setLoading(false)
  }

  const handleDeleteMood = async (moodId) => {
    try {
      await apiDelete(`/api/moods/${moodId}`)
      fetchMoods()
    } catch (error) {
      console.error('Error deleting mood:', error)
    }
  }

  const getMoodStats = () => {
    const moodCounts = {}
    moods.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1
    })
    
    const totalMoods = moods.length
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
    )

    return { totalMoods, mostCommonMood, moodCounts }
  }

  const { totalMoods, mostCommonMood, moodCounts } = getMoodStats()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMoodIcon = (mood) => {
    const moodOption = moodOptions.find(option => option.value === mood)
    return moodOption ? moodOption.icon : Meh
  }

  const getMoodColor = (mood) => {
    const moodOption = moodOptions.find(option => option.value === mood)
    return moodOption ? moodOption.color : 'from-gray-300 to-gray-400'
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold lotus-gradient-text mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-[#5B3B89]">How are you feeling today?</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mood Logging Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="card-lotus">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-[#3A8D8E]" />
                  <span className="lotus-gradient-text">Log Your Mood</span>
                </CardTitle>
                <CardDescription className="text-[#5B3B89]">
                  Select how you're feeling right now and add an optional note
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-600">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Mood Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1E1E2F] mb-4">How are you feeling?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {moodOptions.map((mood) => (
                      <motion.button
                        key={mood.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`relative p-4 rounded-2xl text-white shadow-md transition-all duration-200 bg-gradient-to-br ${mood.color} ${
                          selectedMood === mood.value
                            ? 'ring-2 ring-white/80 shadow-lg scale-[1.02]'
                            : 'opacity-95 hover:opacity-100 hover:shadow-lg'
                        }`}
                      >
                        {/* Decorative sparkles */}
                        <span className="absolute right-3 top-3 w-1.5 h-1.5 bg-white/70 rounded-full"></span>
                        <span className="absolute right-6 top-6 w-1 h-1 bg-white/60 rounded-full"></span>

                        <div className="mb-2">
                          <mood.icon className="h-6 w-6 text-white drop-shadow-sm" />
                        </div>
                        <div className="text-sm font-medium text-white">
                          {mood.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1E1E2F] mb-2">Add a note (optional)</h3>
                  <Textarea
                    placeholder="What's on your mind? Share your thoughts, what triggered this mood, or anything you'd like to remember..."
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    className="border-[#3A8D8E]/20 focus:border-[#3A8D8E] focus:ring-[#3A8D8E]"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleMoodSubmit}
                  disabled={loading || !selectedMood}
                  className="w-full button-lotus text-white py-3"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Logging mood...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Log Mood</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <Card className="card-lotus">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-[#3A8D8E]" />
                  <span className="lotus-gradient-text">Your Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1E1E2F]">{totalMoods}</div>
                  <div className="text-sm text-[#5B3B89]">Total Mood Entries</div>
                </div>
                
                {totalMoods > 0 && (
                  <div className="text-center">
                    {(() => { const Icon = getMoodIcon(mostCommonMood); return <Icon className="h-6 w-6 text-[#3A8D8E] inline-block mb-1" /> })()}
                    <div className="text-sm text-[#5B3B89]">Most Common Mood</div>
                    <div className="text-sm font-medium text-[#1E1E2F] capitalize">{mostCommonMood}</div>
                  </div>
                )}

                <div className="space-y-2">
                  {Object.entries(moodCounts).slice(0, 3).map(([mood, count]) => (
                    <div key={mood} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {(() => { const Icon = getMoodIcon(mood); return <Icon className="h-4 w-4 text-[#3A8D8E]" /> })()}
                        <span className="text-sm capitalize">{mood}</span>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Insights */}
            <Card className="card-lotus">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-[#3A8D8E]" />
                  <span className="lotus-gradient-text">Weekly Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="lotus-gradient-soft p-3 rounded-lg border border-[#3A8D8E]/20">
                    <div className="text-sm font-medium text-[#1E1E2F]">This Week</div>
                    <div className="text-xs text-[#5B3B89]">
                      You've logged {moods.filter(mood => {
                        const moodDate = new Date(mood.createdAt)
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return moodDate >= weekAgo
                      }).length} moods this week
                    </div>
                  </div>
                  
                  {totalMoods > 0 && (
                    <div className="text-xs text-[#5B3B89]">
                      💡 Keep tracking daily to discover your emotional patterns and triggers!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Moods */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="card-lotus">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#3A8D8E]" />
                <span className="lotus-gradient-text">Recent Mood Entries</span>
              </CardTitle>
              <CardDescription className="text-[#5B3B89]">
                Your mood history and notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {moods.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-[#1E1E2F] mb-2">No mood entries yet</h3>
                  <p className="text-[#5B3B89]">Start by logging your first mood above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {moods.slice(0, 10).map((mood) => (
                    <motion.div
                      key={mood._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start space-x-4 p-4 lotus-gradient-soft rounded-lg border border-[#3A8D8E]/20"
                    >
                      <div className={`p-2 rounded-full bg-gradient-to-r ${getMoodColor(mood.mood)}`}>
                        {(() => { const Icon = getMoodIcon(mood.mood); return <Icon className="h-5 w-5 text-white" /> })()}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-[#1E1E2F] capitalize">{mood.mood}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-[#5B3B89]">{formatDate(mood.createdAt)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMood(mood._id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {mood.note && (
                          <p className="text-sm text-[#5B3B89] mt-1">{mood.note}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard

