import { createContext, useContext, useState, useEffect } from 'react'
import { apiGet, apiPost } from '@/lib/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    apiGet('/api/me')
      .then((data) => {
        // Backend returns the user object directly
        if (data && data._id) {
          setUser(data)
        } else {
          localStorage.removeItem('token')
        }
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    try {
      const data = await apiPost('/api/login', { email, password })
      // data: { _id, name, email, token }
      if (data && data.token) {
        localStorage.setItem('token', data.token)
        setUser({ _id: data._id, name: data.name, email: data.email })
        return { success: true }
      }
      return { success: false, message: 'Invalid response from server' }
    } catch (error) {
      return { success: false, message: error.message || 'Network error. Please try again.' }
    }
  }

  const register = async (name, email, password) => {
    try {
      const data = await apiPost('/api/signup', { name, email, password })
      if (data && data.token) {
        localStorage.setItem('token', data.token)
        setUser({ _id: data._id, name: data.name, email: data.email })
        return { success: true }
      }
      return { success: false, message: 'Invalid response from server' }
    } catch (error) {
      return { success: false, message: error.message || 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

