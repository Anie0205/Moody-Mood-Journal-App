import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Alert, AlertDescription } from './ui/alert'
import { Shield, Heart, Brain, Users, AlertTriangle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [agreements, setAgreements] = useState({
    safety: false,
    limitations: false,
    privacy: false,
    emergency: false
  })

  const steps = [
    {
      title: "Welcome to Moody",
      subtitle: "Your safe space for reflection and emotional awareness",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Heart className="h-16 w-16 text-[#5B3B89] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#1E1E2F] mb-2">Welcome to Moody</h2>
            <p className="text-[#5B3B89]">A reflective journaling tool designed for Indian youth</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>What Moody is:</strong> A safe space to express your feelings, reflect on your emotions, and get gentle guidance for communication.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Safety First",
      subtitle: "Your wellbeing is our priority",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-red-500" />
            <h3 className="text-xl font-semibold text-[#1E1E2F]">Safety & Crisis Support</h3>
          </div>
          
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Important:</strong> If you're having thoughts of self-harm or suicide, please reach out for immediate help.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-semibold text-[#1E1E2F]">Emergency Helplines (24/7):</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <div>
                  <span className="font-medium">KIRAN Mental Health</span>
                  <p className="text-sm text-gray-600">Government helpline</p>
                </div>
                <a href="tel:1800-599-0019" className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                  Call 1800-599-0019
                </a>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <div>
                  <span className="font-medium">AASRA Suicide Prevention</span>
                  <p className="text-sm text-gray-600">Crisis intervention</p>
                </div>
                <a href="tel:91-22-27546669" className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                  Call 91-22-27546669
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "What Moody Can Do",
      subtitle: "Understanding the boundaries",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">What Moody CAN do:</span>
              </div>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Help you reflect on your emotions</li>
                <li>• Provide gentle communication guidance</li>
                <li>• Offer supportive listening</li>
                <li>• Help with parent-child communication</li>
                <li>• Provide cultural context for Indian families</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800">What Moody CANNOT do:</span>
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Provide therapy or medical advice</li>
                <li>• Diagnose mental health conditions</li>
                <li>• Replace professional counseling</li>
                <li>• Handle crisis situations alone</li>
                <li>• Provide emergency medical care</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Privacy & Data Protection",
      subtitle: "Your information is safe with us",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-[#5B3B89]" />
            <h3 className="text-xl font-semibold text-[#1E1E2F]">Privacy & Safety</h3>
          </div>
          
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Your Data is Protected:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• All conversations are encrypted</li>
                <li>• No personal information is stored permanently</li>
                <li>• Crisis situations are handled with care</li>
                <li>• Your privacy is our priority</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• This is a journaling aid, not therapy</li>
                <li>• For serious mental health concerns, consult a professional</li>
                <li>• If you're in crisis, contact emergency services</li>
                <li>• Your safety is our top priority</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Agreement & Consent",
      subtitle: "Please read and agree to continue",
      content: (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="safety" 
                checked={agreements.safety}
                onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, safety: checked }))}
              />
              <label htmlFor="safety" className="text-sm text-[#1E1E2F]">
                I understand that Moody is a reflective journaling tool, not therapy or medical advice.
              </label>
            </div>
            
            <div className="flex items-start gap-3">
              <Checkbox 
                id="limitations" 
                checked={agreements.limitations}
                onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, limitations: checked }))}
              />
              <label htmlFor="limitations" className="text-sm text-[#1E1E2F]">
                I understand that for serious mental health concerns, I should consult a qualified professional.
              </label>
            </div>
            
            <div className="flex items-start gap-3">
              <Checkbox 
                id="privacy" 
                checked={agreements.privacy}
                onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, privacy: checked }))}
              />
              <label htmlFor="privacy" className="text-sm text-[#1E1E2F]">
                I understand that my conversations are private and will be handled with care.
              </label>
            </div>
            
            <div className="flex items-start gap-3">
              <Checkbox 
                id="emergency" 
                checked={agreements.emergency}
                onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, emergency: checked }))}
              />
              <label htmlFor="emergency" className="text-sm text-[#1E1E2F]">
                I understand that if I'm in crisis, I should contact emergency services or helplines immediately.
              </label>
            </div>
          </div>
          
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Remember:</strong> If you're having thoughts of self-harm, please reach out to a trusted adult or call a helpline immediately.
            </AlertDescription>
          </Alert>
        </div>
      )
    }
  ]

  const allAgreed = Object.values(agreements).every(Boolean)
  const isLastStep = currentStep === steps.length - 1

  const nextStep = () => {
    if (isLastStep && allAgreed) {
      onComplete()
    } else {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="lotus-gradient-text text-center">
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-center text-[#5B3B89]">
            {steps[currentStep].subtitle}
          </p>
        </CardHeader>
        <CardContent>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep].content}
          </motion.div>
          
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-[#3A8D8E] text-[#3A8D8E] hover:bg-[#3A8D8E]/10"
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-[#5B3B89]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button 
              onClick={nextStep}
              disabled={isLastStep && !allAgreed}
              className="button-lotus"
            >
              {isLastStep ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
