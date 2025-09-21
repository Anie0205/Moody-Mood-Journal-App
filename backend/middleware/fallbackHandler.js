const { initializeGemini } = require('../config/gcp');

// Fallback response generator for when AI services fail
function generateFallbackResponse(userText, context = {}) {
    const lowerText = userText.toLowerCase();
    
    // Simple rule-based responses as fallback
    if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('down')) {
        return {
            reply: "I understand you're going through a difficult time. It's okay to feel this way. Consider reaching out to a trusted friend, family member, or counselor. Remember, you're not alone in this.",
            fallback: true,
            disclaimer: "This is a basic response. For professional support, please contact a mental health professional."
        };
    }
    
    if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('stress')) {
        return {
            reply: "Feeling anxious or stressed is completely normal. Try taking deep breaths, going for a walk, or talking to someone you trust. If these feelings persist, consider speaking with a counselor.",
            fallback: true,
            disclaimer: "This is a basic response. For professional support, please contact a mental health professional."
        };
    }
    
    if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad')) {
        return {
            reply: "It's okay to feel angry or frustrated. These are valid emotions. Try to express your feelings in a healthy way - maybe through writing, talking to someone, or physical activity.",
            fallback: true,
            disclaimer: "This is a basic response. For professional support, please contact a mental health professional."
        };
    }
    
    if (lowerText.includes('academic') || lowerText.includes('study') || lowerText.includes('exam')) {
        return {
            reply: "Academic pressure can be overwhelming. Remember that your worth isn't determined by grades alone. Consider talking to your teachers, parents, or a counselor about your concerns.",
            fallback: true,
            disclaimer: "This is a basic response. For professional support, please contact a mental health professional."
        };
    }
    
    if (lowerText.includes('family') || lowerText.includes('parent')) {
        return {
            reply: "Family relationships can be complex. It's important to communicate your feelings respectfully. Consider having an open conversation with your family members about your concerns.",
            fallback: true,
            disclaimer: "This is a basic response. For professional support, please contact a mental health professional."
        };
    }
    
    // Default fallback response
    return {
        reply: "Thank you for sharing your thoughts with me. I'm here to listen, though I'm currently experiencing technical difficulties. Please remember that your feelings are valid, and if you need immediate support, consider reaching out to a trusted adult or counselor.",
        fallback: true,
        disclaimer: "This is a basic response. For professional support, please contact a mental health professional."
    };
}

// Enhanced error handling with fallback
async function handleAIError(error, userText, context = {}) {
    console.error('AI Service Error:', error);
    
    // Log the error for monitoring
    const errorLog = {
        timestamp: new Date().toISOString(),
        error: error.message,
        userText: userText.substring(0, 100), // Log first 100 chars for debugging
        context: context,
        fallbackUsed: true
    };
    
    // In production, you might want to send this to a monitoring service
    console.log('Error logged:', errorLog);
    
    // Generate fallback response
    return generateFallbackResponse(userText, context);
}

// Fallback middleware for chat endpoints
function chatFallbackMiddleware(req, res, next) {
    const originalSend = res.send;
    
    res.send = function(data) {
        // If the response indicates an AI service failure, try fallback
        if (res.statusCode >= 500 && typeof data === 'string') {
            try {
                const parsedData = JSON.parse(data);
                if (parsedData.message && parsedData.message.includes('AI not configured')) {
                    const fallbackResponse = generateFallbackResponse(req.body.message || req.body.text || '');
                    return originalSend.call(this, JSON.stringify(fallbackResponse));
                }
            } catch (e) {
                // If parsing fails, continue with original response
            }
        }
        return originalSend.call(this, data);
    };
    
    next();
}

// Fallback for translator endpoints
function translatorFallbackMiddleware(req, res, next) {
    const originalSend = res.send;
    
    res.send = function(data) {
        if (res.statusCode >= 500 && typeof data === 'string') {
            try {
                const parsedData = JSON.parse(data);
                if (parsedData.message && parsedData.message.includes('Failed to generate translation')) {
                    const fallbackResponse = {
                        childVersion: req.body.text || 'I want to express my feelings but need help finding the right words.',
                        parentVersion: 'I want to share my feelings with you in a respectful way, but I need help communicating clearly.',
                        neutralSummary: 'The child is expressing their feelings and seeking understanding.',
                        emotion: 'neutral',
                        intent: 'seeking_support',
                        culturalContext: 'General communication challenge',
                        originalText: req.body.text || '',
                        confidence: 0.3,
                        fallback: true,
                        disclaimer: 'This is a basic response. For professional support, please contact a mental health professional.'
                    };
                    return originalSend.call(this, JSON.stringify(fallbackResponse));
                }
            } catch (e) {
                // If parsing fails, continue with original response
            }
        }
        return originalSend.call(this, data);
    };
    
    next();
}

module.exports = {
    generateFallbackResponse,
    handleAIError,
    chatFallbackMiddleware,
    translatorFallbackMiddleware
};
