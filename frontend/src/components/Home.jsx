import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Heart, Sparkles, TrendingUp, Calendar, BookOpen, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

const Home = () => {
  const features = [
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Track your emotions with simple emoji selections and optional notes for deeper reflection."
    },
    {
      icon: Calendar,
      title: "Visual Timeline",
      description: "See your mood patterns over time with beautiful calendar views and trend analysis."
    },
    {
      icon: BarChart3,
      title: "Weekly Insights",
      description: "Get personalized insights about your emotional patterns and triggers."
    },
    {
      icon: BookOpen,
      title: "Mood Journaling",
      description: "Add optional notes to your mood entries for deeper self-reflection and awareness."
    }
  ]

  const stats = [
    { number: "32", label: "Daily Users", color: "from-pink-400 to-rose-400" },
    { number: "82", label: "Mood Entries", color: "from-purple-400 to-pink-400" },
    { number: "28", label: "Insights Generated", color: "from-rose-400 to-orange-400" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50"></div>
        <div className="absolute top-20 left-10 text-pink-300 opacity-30">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="absolute bottom-32 right-20 text-rose-300 opacity-30">
          <Heart className="h-6 w-6" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-2 lg:space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-snug tracking-tight">
                  Let your emotions be seen,{' '}
                  <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    one tap at a time
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-md leading-relaxed">
                  Moody helps you track how you feel — effortlessly. One tap to reflect, one habit to know yourself better.
                </p>
              </div>

              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 text-lg"
                  >
                    Start Tracking
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-pink-200 text-pink-600 hover:bg-pink-50 px-8 py-3 text-lg"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span>Watch Demo</span>
                  </div>
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-pink-200 to-rose-300 rounded-full p-8 lg:p-12">
                <div className="bg-white rounded-full p-6 shadow-lg">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">😊</div>
                    <h3 className="text-xl font-semibold text-gray-800">Feeling Great Today!</h3>
                    <p className="text-gray-600">Track your mood in seconds</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full opacity-70"></div>
                <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-purple-300 rounded-full opacity-70"></div>
                <div className="absolute top-1/2 -right-8 w-4 h-4 bg-pink-400 rounded-full opacity-70"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-200 to-rose-300 rounded-full p-8 lg:p-12">
                <div className="bg-white rounded-full p-6 shadow-lg">
                  <div className="text-center space-y-4">
                    <div className="text-5xl">🌸</div>
                    <h3 className="text-lg font-semibold text-gray-800">Welcome To Moody</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Welcome To{' '}
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Moody
                </span>
              </h2>
              <p className="text-gray-600 text-lg">
                Join thousands of users who are building emotional awareness and improving their mental fitness 
                through consistent mood tracking and self-reflection.
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`bg-gradient-to-r ${stat.color} text-white rounded-2xl p-4 mb-2`}>
                      <div className="text-2xl font-bold">{stat.number}</div>
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              We Can Help{' '}
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Transform You
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover powerful features designed to help you understand your emotions, 
              track patterns, and build lasting emotional wellness habits.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  index === 1 ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white' : ''
                }`}
              >
                <div className={`p-3 rounded-full w-fit mb-4 ${
                  index === 1 
                    ? 'bg-white/20' 
                    : 'bg-gradient-to-r from-pink-100 to-rose-100'
                }`}>
                  <feature.icon className={`h-6 w-6 ${
                    index === 1 ? 'text-white' : 'text-pink-600'
                  }`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  index === 1 ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${
                  index === 1 ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
                {index === 1 && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="mt-4 bg-white text-pink-600 hover:bg-gray-50"
                  >
                    Learn More →
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Proving Our{' '}
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Expertise
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                Built with modern web technologies and designed with mental health professionals, 
                Moody provides a scientifically-backed approach to emotional wellness tracking.
              </p>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg p-4">
                  <div className="h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mb-2"></div>
                  <div className="text-sm text-gray-600">User Engagement: 95%</div>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                  <div className="h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-2 w-4/5"></div>
                  <div className="text-sm text-gray-600">Mood Improvement: 87%</div>
                </div>
                <div className="bg-gradient-to-r from-rose-100 to-orange-100 rounded-lg p-4">
                  <div className="h-3 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full mb-2 w-3/4"></div>
                  <div className="text-sm text-gray-600">Daily Usage: 78%</div>
                </div>
              </div>

              <Link to="/register">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3"
                >
                  Start Your Journey
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-pink-200 to-rose-300 rounded-full p-8 lg:p-12">
                <div className="bg-white rounded-full p-6 shadow-lg">
                  <div className="text-center space-y-4">
                    <div className="text-5xl">📊</div>
                    <h3 className="text-lg font-semibold text-gray-800">Track Your Progress</h3>
                    <p className="text-gray-600 text-sm">Visualize your emotional journey</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full opacity-70"></div>
                <div className="absolute -bottom-6 -right-6 w-6 h-6 bg-purple-300 rounded-full opacity-70"></div>
                <div className="absolute top-1/4 -left-8 w-4 h-4 bg-pink-400 rounded-full opacity-70"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home

