import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Flower2, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar-lotus sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="lotus-gradient p-2 rounded-full group-hover:scale-110 transition-transform duration-200">
              <Flower2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold lotus-gradient-text">
              Moody
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors duration-200 hover:text-[#3A8D8E] ${
                isActive('/') ? 'text-[#3A8D8E]' : 'text-[#1E1E2F]'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/anonymous" 
              className={`text-sm font-medium transition-colors duration-200 hover:text-[#3A8D8E] ${
                isActive('/anonymous') ? 'text-[#3A8D8E]' : 'text-[#1E1E2F]'
              }`}
            >
              Anonymous Chat
            </Link>
            <Link 
              to="/vent" 
              className={`text-sm font-medium transition-colors duration-200 hover:text-[#3A8D8E] ${
                isActive('/vent') ? 'text-[#3A8D8E]' : 'text-[#1E1E2F]'
              }`}
            >
              Vent Space
            </Link>
            <Link 
              to="/translator" 
              className={`text-sm font-medium transition-colors duration-200 hover:text-[#3A8D8E] ${
                isActive('/translator') ? 'text-[#3A8D8E]' : 'text-[#1E1E2F]'
              }`}
            >
              Parent Translator
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors duration-200 hover:text-[#3A8D8E] ${
                    isActive('/dashboard') ? 'text-[#3A8D8E]' : 'text-[#1E1E2F]'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-[#5B3B89]">Hi, {user.name}!</span>
                  <Button 
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="border-[#3A8D8E] text-[#3A8D8E] hover:bg-[#3A8D8E]/10"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-sm font-medium text-[#1E1E2F] hover:text-[#3A8D8E] transition-colors duration-200"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button 
                    size="sm"
                    className="button-lotus text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#1E1E2F]"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#3A8D8E]/20">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors duration-200 hover:text-[#3A8D8E] ${
                  isActive('/') ? 'text-[#3A8D8E]' : 'text-[#1E1E2F]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/anonymous" 
                className={`text-sm font-medium transition-colors duration-200 hover:text-[#3A8D8E] ${
                  isActive('/anonymous') ? 'text-[#3A8D8E]' : 'text-[#1E1E2F]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Anonymous Chat
              </Link>
              <Link 
                to="/vent" 
                className={`text-sm font-medium transition-colors duration-200 hover:text-[#3A8D8E] ${
                  isActive('/vent') ? 'text-[#3A8D8E]' : 'text-[#1E1E2F]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Vent Space
              </Link>
              <Link 
                to="/translator" 
                className={`text-sm font-medium transition-colors duration-200 hover:text-[#3A8D8E] ${
                  isActive('/translator') ? 'text-[#3A8D8E]' : 'text-[#1E1E2F]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Parent Translator
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`text-sm font-medium transition-colors duration-200 hover:text-[#3A8D8E] ${
                      isActive('/dashboard') ? 'text-[#3A8D8E]' : 'text-[#1E1E2F]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm text-[#5B3B89]">Hi, {user.name}!</span>
                    <Button 
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      variant="outline"
                      size="sm"
                      className="border-[#3A8D8E] text-[#3A8D8E] hover:bg-[#3A8D8E]/10 w-fit"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login"
                    className="text-sm font-medium text-[#1E1E2F] hover:text-[#3A8D8E] transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      size="sm"
                      className="button-lotus text-white w-fit"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

