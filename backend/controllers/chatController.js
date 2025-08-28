const { initializeGemini } = require('../config/gcp');

function buildEmpathyPrompt(userText, conversationHistory = []) {
    let contextPrompt = `You are a supportive, non-judgmental friend in an anonymous chat. 
Respond briefly (2-5 sentences), avoiding medical claims. Encourage reflection and coping. 
No therapy disclaimers unless asked. Be contextually aware of the ongoing conversation.

Conversation History:
`;
    
    if (conversationHistory.length > 0) {
        contextPrompt += conversationHistory.map(msg => 
            `${msg.role === 'user' ? 'User' : 'You'}: ${msg.text}`
        ).join('\n') + '\n\n';
    }
    
    contextPrompt += `Current message from User: "${userText}"
Respond empathetically, considering the conversation context.`;
    
    return contextPrompt;
}

exports.anonymousChat = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;
        if (!message) return res.status(400).json({ message: 'message is required' });

        const genai = await initializeGemini();
        if (!genai) return res.status(500).json({ message: 'AI not configured' });

        const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = buildEmpathyPrompt(message, conversationHistory);
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Optional: do a lightweight output safety check here if needed on UI side as well
        return res.status(200).json({ reply: text });
    } catch (err) {
        console.error('anonymousChat error', err);
        return res.status(500).json({ message: 'Failed to generate response' });
    }
};


