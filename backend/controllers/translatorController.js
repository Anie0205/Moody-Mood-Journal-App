const { initializeGemini } = require('../config/gcp');
const { analyzeSafety } = require('../middleware/safety');
const { languageClient } = require('../config/gcp');
const { handleAIError, generateFallbackResponse } = require('../middleware/fallbackHandler');

// Enhanced emotion classification using Google Cloud NLP
async function classifyEmotionAndIntent(text) {
    try {
        // Use Google Cloud Natural Language API for sentiment and entity analysis
        const [sentimentResult] = await languageClient.analyzeSentiment({
            document: { content: text, type: 'PLAIN_TEXT' },
            encodingType: 'UTF8',
        });
        
        const [entityResult] = await languageClient.analyzeEntities({
            document: { content: text, type: 'PLAIN_TEXT' },
            encodingType: 'UTF8',
        });
        
        const sentimentScore = sentimentResult.documentSentiment?.score ?? 0;
        const sentimentMagnitude = sentimentResult.documentSentiment?.magnitude ?? 0;
        
        // Enhanced emotion classification based on sentiment analysis
        let emotion = 'neutral';
        let confidence = 0.5;
        
        if (sentimentScore < -0.6) {
            if (sentimentMagnitude > 0.8) {
                emotion = 'sadness/depression';
                confidence = Math.min(0.9, Math.abs(sentimentScore) + sentimentMagnitude * 0.3);
            } else {
                emotion = 'frustration/anger';
                confidence = Math.min(0.8, Math.abs(sentimentScore) + sentimentMagnitude * 0.2);
            }
        } else if (sentimentScore < -0.2) {
            emotion = 'anxiety/worry';
            confidence = Math.min(0.7, Math.abs(sentimentScore) + sentimentMagnitude * 0.2);
        } else if (sentimentScore > 0.6) {
            emotion = 'happiness/excitement';
            confidence = Math.min(0.9, sentimentScore + sentimentMagnitude * 0.3);
        } else if (sentimentScore > 0.2) {
            emotion = 'contentment';
            confidence = Math.min(0.7, sentimentScore + sentimentMagnitude * 0.2);
        }
        
        // Intent detection based on entities and keywords
        let intent = 'informational';
        const entities = entityResult.entities || [];
        const lowerText = text.toLowerCase();
        
        // Academic context detection
        const academicKeywords = ['study', 'exam', 'school', 'college', 'university', 'academic', 'grade', 'marks', 'result'];
        const academicEntities = entities.filter(e => 
            e.type === 'ORGANIZATION' && 
            (e.name.toLowerCase().includes('school') || e.name.toLowerCase().includes('college') || e.name.toLowerCase().includes('university'))
        );
        
        if (academicKeywords.some(keyword => lowerText.includes(keyword)) || academicEntities.length > 0) {
            intent = 'academic_concern';
        }
        // Family/parent context detection
        else if (lowerText.includes('parent') || lowerText.includes('family') || lowerText.includes('mother') || lowerText.includes('father')) {
            intent = 'family_concern';
        }
        // Social context detection
        else if (lowerText.includes('friend') || lowerText.includes('social') || lowerText.includes('relationship') || lowerText.includes('peer')) {
            intent = 'social_concern';
        }
        // Career context detection
        else if (lowerText.includes('career') || lowerText.includes('job') || lowerText.includes('future') || lowerText.includes('career')) {
            intent = 'career_concern';
        }
        // Support seeking detection
        else if (lowerText.includes('help') || lowerText.includes('support') || lowerText.includes('advice') || lowerText.includes('guidance')) {
            intent = 'seeking_support';
        }
        
        return { 
            emotion, 
            intent, 
            confidence,
            sentimentScore,
            sentimentMagnitude
        };
        
    } catch (error) {
        console.error('Emotion classification error:', error);
        // Fallback to simple keyword-based classification
        return fallbackEmotionClassification(text);
    }
}

// Fallback emotion classification using keywords
function fallbackEmotionClassification(text) {
    const lowerText = text.toLowerCase();
    
    let emotion = 'neutral';
    let intent = 'informational';
    
    // Basic emotion detection
    if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('hate')) {
        emotion = 'frustration/anger';
    } else if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('hopeless')) {
        emotion = 'sadness/depression';
    } else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('stress')) {
        emotion = 'anxiety/worry';
    } else if (lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('burnout')) {
        emotion = 'exhaustion/burnout';
    } else if (lowerText.includes('happy') || lowerText.includes('excited') || lowerText.includes('great')) {
        emotion = 'happiness/excitement';
    }
    
    // Basic intent detection
    if (lowerText.includes('understand') || lowerText.includes('help') || lowerText.includes('support')) {
        intent = 'seeking_support';
    } else if (lowerText.includes('pressure') || lowerText.includes('expectations') || lowerText.includes('demands')) {
        intent = 'expressing_pressure';
    } else if (lowerText.includes('school') || lowerText.includes('study') || lowerText.includes('academic')) {
        intent = 'academic_concern';
    } else if (lowerText.includes('friend') || lowerText.includes('social') || lowerText.includes('relationship')) {
        intent = 'social_concern';
    }
    
    return { emotion, intent, confidence: 0.3 };
}

// Cultural context mapping for Indian parent-teen communication
function getCulturalContext(emotion, intent) {
    const contextMap = {
        'frustration/anger': {
            'academic_concern': 'Academic pressure and parental expectations',
            'seeking_support': 'Need for understanding without judgment',
            'expressing_pressure': 'High expectations vs. personal limits'
        },
        'sadness/depression': {
            'academic_concern': 'Academic performance affecting self-worth',
            'social_concern': 'Social isolation and peer pressure',
            'seeking_support': 'Need for emotional validation'
        },
        'anxiety/worry': {
            'academic_concern': 'Fear of disappointing parents',
            'expressing_pressure': 'Overwhelming academic demands',
            'seeking_support': 'Need for reassurance and guidance'
        },
        'exhaustion/burnout': {
            'academic_concern': 'Academic workload and stress',
            'expressing_pressure': 'Multiple responsibilities',
            'seeking_support': 'Need for rest and understanding'
        }
    };
    
    return contextMap[emotion]?.[intent] || 'General communication challenge';
}

function buildContextualPrompt(userText, emotion, intent, culturalContext, userLanguage = 'en') {
    const isHindi = userLanguage === 'hi';
    
    return `You are a cultural communication bridge specialist for Indian families. Your role is to help children communicate their feelings to parents in a respectful, clear, and culturally-sensitive way.

Context:
- Child's emotion: ${emotion}
- Child's intent: ${intent}
- Cultural context: ${culturalContext}
- Original text: "${userText}"
- User's language: ${userLanguage}

Your task is to create THREE versions:

1. CHILD VERSION: A clear, honest expression of the child's feelings that maintains authenticity
2. PARENT VERSION: A respectful, culturally-appropriate way to communicate this to Indian parents
3. NEUTRAL SUMMARY: An objective summary that both parties can understand

Guidelines:
- Maintain the child's emotional truth
- Use respectful language appropriate for Indian parent-child dynamics
- Consider cultural values (respect for elders, family harmony)
- Avoid clinical/therapy language
- Keep it concise (2-3 sentences each)
${isHindi ? `- Use natural Hindi/Hinglish slang that Indian youth actually use
- Mix Hindi and English naturally (Hinglish style)
- Use respectful Hindi terms for parents (माता-पिता, आप, etc.)
- Include common Hindi expressions like "मुझे लगता है", "शायद", "बस"` : ''}

Format your response as:
CHILD VERSION: [text]
PARENT VERSION: [text]  
NEUTRAL SUMMARY: [text]`;
}

exports.translateToIndianParent = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'text is required' });

        // Safety check input
        const { unsafe } = await analyzeSafety(text);
        if (unsafe) return res.status(400).json({ message: 'Content appears unsafe or inappropriate.' });

        // Step 1: Detect user language
        let userLanguage = 'en';
        try {
            const { translateClient } = require('../config/gcp');
            const [detection] = await translateClient.detect(text);
            userLanguage = detection.language;
        } catch (e) {
            console.log('Language detection failed, defaulting to English:', e);
        }

        // Step 2: Enhanced Emotion and Intent Classification
        const { emotion, intent, confidence, sentimentScore, sentimentMagnitude } = await classifyEmotionAndIntent(text);
        
        // Step 3: Cultural Context Mapping
        const culturalContext = getCulturalContext(emotion, intent);
        
        // Step 4: Generate contextual prompt with language awareness
        const prompt = buildContextualPrompt(text, emotion, intent, culturalContext, userLanguage);
        
        // Step 4: Call Gemini API with fallback
        const genai = await initializeGemini();
        if (!genai) {
            // Use fallback when AI is not configured
            const fallbackResponse = {
                childVersion: text,
                parentVersion: 'I want to share my feelings with you in a respectful way, but I need help finding the right words.',
                neutralSummary: 'The child is expressing their feelings and seeking understanding.',
                emotion,
                intent,
                culturalContext,
                originalText: text,
                confidence: 0.3,
                fallback: true,
                disclaimer: 'This is a basic response. For professional support, please contact a mental health professional.'
            };
            return res.status(200).json(fallbackResponse);
        }
        
        const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        // Step 5: Parse structured response
        const lines = response.split('\n').filter(line => line.trim());
        let childVersion = '', parentVersion = '', neutralSummary = '';
        
        lines.forEach(line => {
            if (line.startsWith('CHILD VERSION:')) {
                childVersion = line.replace('CHILD VERSION:', '').trim();
            } else if (line.startsWith('PARENT VERSION:')) {
                parentVersion = line.replace('PARENT VERSION:', '').trim();
            } else if (line.startsWith('NEUTRAL SUMMARY:')) {
                neutralSummary = line.replace('NEUTRAL SUMMARY:', '').trim();
            }
        });
        
        // Step 6: Safety check output
        const outputCheck = await analyzeSafety(parentVersion);
        if (outputCheck.unsafe) {
            return res.status(200).json({
                childVersion: text,
                parentVersion: 'I want to communicate my feelings respectfully, but I need help finding the right words. Can we talk about this?',
                neutralSummary: 'The child is seeking help to communicate difficult feelings to their parents.',
                emotion,
                intent,
                culturalContext
            });
        }
        
        // Final response with enhanced metadata
        const output = {
            childVersion: childVersion || text,
            parentVersion: parentVersion || 'I want to share my feelings with you in a respectful way.',
            neutralSummary: neutralSummary || 'The child is expressing their feelings and seeking understanding.',
            emotion,
            intent,
            culturalContext,
            originalText: text,
            detectedLanguage: userLanguage,
            confidence: confidence || 0.5,
            sentimentScore: sentimentScore || 0,
            sentimentMagnitude: sentimentMagnitude || 0,
            disclaimer: 'This is a communication aid, not professional therapy. For serious mental health concerns, please consult a qualified professional.'
        };

        return res.status(200).json(output);
    } catch (err) {
        console.error('translateToIndianParent error', err);
        return res.status(500).json({ message: 'Failed to generate translation' });
    }
};


