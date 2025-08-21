import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiGet, apiPost, apiDelete } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, TrendingUp, Heart, Smile, Frown, Meh, Plus, Trash2, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

const Dashboard = () => {
  const { user } = useAuth()
  const [moods, setMoods] = useState([])
  const [selectedMood, setSelectedMood] = useState('')
  const [moodNote, setMoodNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy', color: 'from-yellow-400 to-orange-400' },
    { emoji: '😢', label: 'Sad', value: 'sad', color: 'from-blue-400 to-indigo-400' },
    { emoji: '😠', label: 'Angry', value: 'angry', color: 'from-red-400 to-pink-400' },
    { emoji: '😰', label: 'Anxious', value: 'anxious', color: 'from-purple-400 to-pink-400' },
    { emoji: '😴', label: 'Tired', value: 'tired', color: 'from-gray-400 to-slate-400' },
    { emoji: '😌', label: 'Calm', value: 'calm', color: 'from-green-400 to-emerald-400' },
    { emoji: '🤗', label: 'Excited', value: 'excited', color: 'from-pink-400 to-rose-400' },
    { emoji: '😐', label: 'Neutral', value: 'neutral', color: 'from-gray-300 to-gray-400' }
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

  const getMoodEmoji = (mood) => {
    const moodOption = moodOptions.find(option => option.value === mood)
    return moodOption ? moodOption.emoji : '😐'
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">How are you feeling today?</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mood Logging Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border-pink-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span>Log Your Mood</span>
                </CardTitle>
                <CardDescription>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {moodOptions.map((mood) => (
                      <motion.button
                        key={mood.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedMood === mood.value
                            ? `border-pink-400 bg-gradient-to-r ${mood.color} text-white shadow-lg`
                            : 'border-gray-200 bg-white hover:border-pink-200 hover:shadow-md'
                        }`}
                      >
                        <div className="text-2xl mb-2">{mood.emoji}</div>
                        <div className={`text-sm font-medium ${
                          selectedMood === mood.value ? 'text-white' : 'text-gray-700'
                        }`}>
                          {mood.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add a note (optional)</h3>
                  <Textarea
                    placeholder="What's on your mind? Share your thoughts, what triggered this mood, or anything you'd like to remember..."
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleMoodSubmit}
                  disabled={loading || !selectedMood}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3"
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
            <Card className="border-pink-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-pink-500" />
                  <span>Your Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{totalMoods}</div>
                  <div className="text-sm text-gray-600">Total Mood Entries</div>
                </div>
                
                {totalMoods > 0 && (
                  <div className="text-center">
                    <div className="text-2xl mb-1">{getMoodEmoji(mostCommonMood)}</div>
                    <div className="text-sm text-gray-600">Most Common Mood</div>
                    <div className="text-sm font-medium text-gray-900 capitalize">{mostCommonMood}</div>
                  </div>
                )}

                <div className="space-y-2">
                  {Object.entries(moodCounts).slice(0, 3).map(([mood, count]) => (
                    <div key={mood} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{getMoodEmoji(mood)}</span>
                        <span className="text-sm capitalize">{mood}</span>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Insights */}
            <Card className="border-pink-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-pink-500" />
                  <span>Weekly Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">This Week</div>
                    <div className="text-xs text-gray-600">
                      You've logged {moods.filter(mood => {
                        const moodDate = new Date(mood.createdAt)
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return moodDate >= weekAgo
                      }).length} moods this week
                    </div>
                  </div>
                  
                  {totalMoods > 0 && (
                    <div className="text-xs text-gray-600">
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
          <Card className="border-pink-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-pink-500" />
                <span>Recent Mood Entries</span>
              </CardTitle>
              <CardDescription>
                Your mood history and notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {moods.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No mood entries yet</h3>
                  <p className="text-gray-600">Start by logging your first mood above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {moods.slice(0, 10).map((mood) => (
                    <motion.div
                      key={mood._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg"
                    >
                      <div className={`p-2 rounded-full bg-gradient-to-r ${getMoodColor(mood.mood)}`}>
                        <span className="text-lg">{getMoodEmoji(mood.mood)}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 capitalize">{mood.mood}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{formatDate(mood.createdAt)}</span>
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
                          <p className="text-sm text-gray-600 mt-1">{mood.note}</p>
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

