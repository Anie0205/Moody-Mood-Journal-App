const { initializeGemini } = require('../config/gcp');
const { analyzeSafety } = require('../middleware/safety');

// Emotion classification function (simplified version - can be replaced with ML model later)
function classifyEmotionAndIntent(text) {
    const lowerText = text.toLowerCase();
    
    // Simple keyword-based classification (replace with ML model)
    let emotion = 'neutral';
    let intent = 'informational';
    
    // Emotion detection
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
    
    // Intent detection
    if (lowerText.includes('understand') || lowerText.includes('help') || lowerText.includes('support')) {
        intent = 'seeking_support';
    } else if (lowerText.includes('pressure') || lowerText.includes('expectations') || lowerText.includes('demands')) {
        intent = 'expressing_pressure';
    } else if (lowerText.includes('school') || lowerText.includes('study') || lowerText.includes('academic')) {
        intent = 'academic_concern';
    } else if (lowerText.includes('friend') || lowerText.includes('social') || lowerText.includes('relationship')) {
        intent = 'social_concern';
    }
    
    return { emotion, intent };
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

function buildContextualPrompt(userText, emotion, intent, culturalContext) {
    return `You are a cultural communication bridge specialist for Indian families. Your role is to help children communicate their feelings to parents in a respectful, clear, and culturally-sensitive way.

Context:
- Child's emotion: ${emotion}
- Child's intent: ${intent}
- Cultural context: ${culturalContext}
- Original text: "${userText}"

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

Format your response as:
CHILD VERSION: [text]
PARENT VERSION: [text]  
NEUTRAL SUMMARY: [text]`;
}

exports.translateToIndianParent = async (req, res) => {
    try {
        const { text, moodEntry, metadata = {} } = req.body;
        if (!text) return res.status(400).json({ message: 'text is required' });

        // Safety check input
        const { unsafe } = await analyzeSafety(text);
        if (unsafe) return res.status(400).json({ message: 'Content appears unsafe or inappropriate.' });

        // Step 1: Emotion and Intent Classification
        const { emotion, intent } = classifyEmotionAndIntent(text);
        
        // Step 2: Cultural Context Mapping
        const culturalContext = getCulturalContext(emotion, intent);
        
        // Step 3: Generate contextual prompt
        const prompt = buildContextualPrompt(text, emotion, intent, culturalContext);
        
        // Step 4: Call Gemini API
        const genai = await initializeGemini();
        if (!genai) return res.status(500).json({ message: 'AI not configured' });
        
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
        
        // Step 7: Return structured response
        return res.status(200).json({
            childVersion: childVersion || text,
            parentVersion: parentVersion || 'I want to share my feelings with you in a respectful way.',
            neutralSummary: neutralSummary || 'The child is expressing their feelings and seeking understanding.',
            emotion,
            intent,
            culturalContext,
            originalText: text
        });
        
    } catch (err) {
        console.error('translateToIndianParent error', err);
        return res.status(500).json({ message: 'Failed to generate translation' });
    }
};


