const { analyzeSafety } = require('./safety');

// Crisis detection middleware specifically for chat endpoints
function crisisDetectionMiddleware(req, res, next) {
    const text = req.body?.message || req.body?.text || '';
    if (!text) return next();

    analyzeSafety(text).then((result) => {
        if (result.crisis) {
            // Crisis detected - return emergency resources instead of AI response
            return res.status(200).json({
                crisis: true,
                message: 'We\'re concerned about your safety. Please reach out for immediate help.',
                emergencyResources: {
                    helplines: [
                        { 
                            name: 'KIRAN Mental Health Helpline', 
                            number: '1800-599-0019', 
                            available: '24/7',
                            description: 'Government mental health helpline'
                        },
                        { 
                            name: 'AASRA Suicide Prevention', 
                            number: '91-22-27546669', 
                            available: '24/7',
                            description: 'Crisis intervention and emotional support'
                        },
                        { 
                            name: 'Vandrevala Foundation', 
                            number: '1860-2662-345', 
                            available: '24/7',
                            description: 'Mental health support and counseling'
                        },
                        { 
                            name: 'Snehi', 
                            number: '91-11-65978181', 
                            available: '24/7',
                            description: 'Mental health support for youth'
                        }
                    ],
                    emergency: 'If you\'re in immediate danger, call 100 (Police) or 108 (Ambulance)',
                    onlineResources: [
                        'Visit your nearest government hospital for immediate help',
                        'Contact your family doctor or a trusted adult',
                        'Reach out to a school counselor if you\'re a student'
                    ]
                },
                aiResponse: 'I\'m not able to provide a response right now. Your safety is our priority. Please use the resources above.',
                disclaimer: 'This is not a replacement for professional mental health care. If you\'re having thoughts of self-harm, please seek immediate professional help.'
            });
        }
        
        // Add safety context to request for downstream processing
        req.safetyContext = result;
        next();
    }).catch((err) => {
        console.error('Crisis detection error:', err);
        // On error, allow through but log the issue
        next();
    });
}

module.exports = crisisDetectionMiddleware;
