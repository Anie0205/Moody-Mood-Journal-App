const { initializeGemini } = require('../config/gcp');
const { analyzeSafety } = require('../middleware/safety');

function buildTranslatorPrompt(userText) {
    return `Rephrase the user's message to an Indian parent in respectful, culturally sensitive Hinglish.
Goals:
- Maintain respect markers (Papa/Mummy, aap), soften tone, show gratitude.
- Be honest but non-argumentative. Avoid slang or insults. Keep it 1-3 sentences.
Original: "${userText}"
Rephrased:`;
}

exports.translateToIndianParent = async (req, res) => {
    try {
        const { text } = req.body || {};
        if (!text) return res.status(400).json({ message: 'text is required' });

        const { unsafe } = await analyzeSafety(text);
        if (unsafe) return res.status(400).json({ message: 'Content appears unsafe or inappropriate.' });

        const genai = await initializeGemini();
        if (!genai) return res.status(500).json({ message: 'AI not configured' });
        const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = buildTranslatorPrompt(text);
        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        const outCheck = await analyzeSafety(reply);
        if (outCheck.unsafe) {
            return res.status(200).json({ translation: 'Aapki feelings mere liye bahut important hain. Chaliye aaram se baat karte hain, main izzat se apni baat rakhunga.' });
        }

        return res.status(200).json({ translation: reply });
    } catch (err) {
        console.error('translateToIndianParent error', err);
        return res.status(500).json({ message: 'Failed to generate translation' });
    }
};


