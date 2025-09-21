const { initializeGemini } = require('../config/gcp');
const crisisDetection = require('../middleware/crisisDetection');
const { handleAIError, generateFallbackResponse } = require('../middleware/fallbackHandler');

function buildEmpathyPrompt(userText, conversationHistory = []) {
    let contextPrompt = `You are a supportive, non-judgmental friend in an anonymous chat for Indian youth. 
You are NOT a therapist or medical professional. You provide emotional support and gentle guidance.

IMPORTANT SAFETY GUIDELINES:
- If the user mentions self-harm, suicide, or crisis, DO NOT provide advice
- Encourage professional help for serious mental health concerns
- Keep responses brief (2-4 sentences)
- Be culturally sensitive to Indian family dynamics
- Avoid medical claims or therapy language
- Focus on listening, validation, and gentle coping suggestions

Context:
- This is a reflective journaling aid, not therapy
- User may be dealing with academic pressure, family expectations, or social stress
- Be supportive but maintain boundaries

Conversation History:
`;
    
    if (conversationHistory.length > 0) {
        contextPrompt += conversationHistory.map(msg => 
            `${msg.role === 'user' ? 'User' : 'You'}: ${msg.text}`
        ).join('\n') + '\n\n';
    }
    
    contextPrompt += `Current message from User: "${userText}"

Respond empathetically, considering the conversation context. If the user seems to be in crisis, gently suggest they reach out to a trusted adult or helpline.`;
    
    return contextPrompt;
}

exports.anonymousChat = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;
        if (!message) return res.status(400).json({ message: 'message is required' });

        const genai = await initializeGemini();
        if (!genai) {
            // Use fallback when AI is not configured
            const fallbackResponse = generateFallbackResponse(message, { conversationHistory });
            return res.status(200).json(fallbackResponse);
        }

        const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = buildEmpathyPrompt(message, conversationHistory);
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Optional: do a lightweight output safety check here if needed on UI side as well
        return res.status(200).json({ reply: text });
    } catch (err) {
        console.error('anonymousChat error', err);
        
        // Use fallback response on error
        const fallbackResponse = await handleAIError(err, message, { conversationHistory });
        return res.status(200).json(fallbackResponse);
    }
};


