const { initializeGemini } = require('../config/gcp');

function buildEmpathyPrompt(userText) {
    return `You are a supportive, non-judgmental friend. Respond briefly (2-5 sentences),
avoiding medical claims. Encourage reflection and coping. No therapy disclaimers unless asked.
User said: "${userText}"
Respond empathetically.`;
}

exports.anonymousChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: 'message is required' });

        const genai = await initializeGemini();
        if (!genai) return res.status(500).json({ message: 'AI not configured' });

        const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = buildEmpathyPrompt(message);
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Optional: do a lightweight output safety check here if needed on UI side as well
        return res.status(200).json({ reply: text });
    } catch (err) {
        console.error('anonymousChat error', err);
        return res.status(500).json({ message: 'Failed to generate response' });
    }
};


