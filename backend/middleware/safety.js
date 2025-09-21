const {languageClient} = require('../config/gcp');

// Crisis detection patterns - more comprehensive for mental health safety
const crisisPatterns = [
    // Direct self-harm indicators
    /\b(kill\s+myself|end\s+my\s+life|suicide|self\s*harm)\b/i,
    /\b(die|dying|dead|death)\s+(myself|me)\b/i,
    /\b(not\s+worth\s+living|better\s+off\s+dead)\b/i,
    /\b(planning\s+to\s+die|want\s+to\s+die)\b/i,
    
    // Indirect but serious indicators
    /\b(i\s+can't\s+go\s+on|can't\s+take\s+it\s+anymore)\b/i,
    /\b(hopeless|no\s+point|nothing\s+matters)\b/i,
    /\b(final\s+goodbye|last\s+time)\b/i,
    
    // Indian context specific patterns
    /\b(academic\s+pressure\s+too\s+much|parents\s+expectations\s+kill)\b/i,
    /\b(exam\s+stress\s+unbearable|career\s+pressure\s+overwhelming)\b/i,
];

// Content moderation patterns (less severe but still concerning)
const moderationPatterns = [
    /\bslur\b/i,
    /\bnsfw\b/i,
    /\bsex(ual)?\b/i,
    /\bporn\b/i,
    /\bracist|racism\b/i,
    /\bharass(ing|ment)?\b/i,
];

async function analyzeSafety(text) {
    try {
        // Crisis detection - highest priority
        const crisisDetected = crisisPatterns.some((pattern) => pattern.test(text));
        if (crisisDetected) {
            return { 
                unsafe: true, 
                crisis: true, 
                sentimentScore: -1,
                riskLevel: 'CRISIS',
                message: 'Crisis detected - immediate support needed'
            };
        }

        // Sentiment analysis for additional context
        const [sentimentResult] = await languageClient.analyzeSentiment({
            document: { content: text, type: 'PLAIN_TEXT' },
            encodingType: 'UTF8',
        });
        const sentimentScore = sentimentResult.documentSentiment?.score ?? 0;

        // Content moderation for inappropriate content
        const moderationHit = moderationPatterns.some((pattern) => pattern.test(text));
        
        // Enhanced classification for sensitive topics
        let sensitive = false;
        try {
            if (text && text.split(/\s+/).length >= 20) {
                const [classifyResult] = await languageClient.classifyText({
                    document: { content: text, type: 'PLAIN_TEXT' },
                });
                const categories = classifyResult.categories?.map(c => c.name) || [];
                sensitive = categories.some(name => /Sensitive Subjects|Adult/i.test(name));
            }
        } catch (_) {
            // ignore classification errors
        }

        // Risk assessment based on multiple factors
        let riskLevel = 'LOW';
        if (sentimentScore < -0.7) riskLevel = 'MEDIUM';
        if (sentimentScore < -0.9) riskLevel = 'HIGH';
        if (moderationHit || sensitive) riskLevel = 'HIGH';

        const unsafe = moderationHit || sensitive;
        
        return { 
            unsafe, 
            crisis: false,
            sentimentScore, 
            riskLevel,
            moderationHit,
            sensitive
        };
    } catch (err) {
        console.error('Safety analysis error:', err);
        // On failure, be conservative but not blocking
        return { 
            unsafe: false, 
            crisis: false,
            sentimentScore: 0, 
            riskLevel: 'UNKNOWN',
            error: true
        };
    }
}

function safetyMiddleware(req, res, next) {
    const text = req.body?.text || req.body?.message || '';
    if (!text) return next();
    
    analyzeSafety(text).then((result) => {
        if (result.crisis) {
            // Crisis detected - block AI response and show emergency resources
            return res.status(200).json({
                crisis: true,
                message: 'We\'re concerned about your safety. Please reach out for immediate help.',
                emergencyResources: {
                    helplines: [
                        { name: 'KIRAN Mental Health Helpline', number: '1800-599-0019', available: '24/7' },
                        { name: 'AASRA Suicide Prevention', number: '91-22-27546669', available: '24/7' },
                        { name: 'Vandrevala Foundation', number: '1860-2662-345', available: '24/7' },
                        { name: 'Snehi', number: '91-11-65978181', available: '24/7' }
                    ],
                    emergency: 'If you\'re in immediate danger, call 100 (Police) or 108 (Ambulance)'
                },
                aiResponse: 'I\'m not able to provide a response right now. Your safety is our priority. Please use the resources above.'
            });
        }
        
        if (result.unsafe) {
            return res.status(400).json({ 
                message: 'Content appears unsafe or inappropriate.',
                riskLevel: result.riskLevel
            });
        }
        
        // Add safety context to request for downstream processing
        req.safetyContext = result;
        next();
    }).catch((err) => {
        console.error('Safety middleware error:', err);
        // On error, allow through but log the issue
        next();
    });
}

module.exports = safetyMiddleware;
module.exports.analyzeSafety = analyzeSafety;


