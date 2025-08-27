const { initializeGemini } = require('../config/gcp');
const { analyzeSafety } = require('../middleware/safety');
const VentEntry = require('../models/VentEntry');

function buildVentPrompt(userText, sentimentScore) {
    const tone = sentimentScore < -0.25 ? 'very gentle and validating' : 'warm and encouraging';
    return `You are an empathetic friend in a private vent space.
Respond in 3-6 sentences with ${tone} tone. Avoid clinical advice or diagnoses.
Offer reflection and 1-2 simple coping suggestions.
User vent: "${userText}"`;
}

exports.createVent = async (req, res) => {
    try {
        const { text } = req.body || {};
        if (!text) return res.status(400).json({ message: 'text is required' });

        // Safety check input
        const { unsafe, sentimentScore } = await analyzeSafety(text);
        if (unsafe) return res.status(400).json({ message: 'Content appears unsafe or inappropriate.' });

        // Store vent entry in MongoDB
        const entry = await VentEntry.create({
            user: req.user._id || req.user.id,
            text,
        });

        const genai = await initializeGemini();
        if (!genai) return res.status(500).json({ message: 'AI not configured' });
        const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = buildVentPrompt(text, sentimentScore);
        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        // Optionally safety check output
        const outCheck = await analyzeSafety(reply);
        if (outCheck.unsafe) {
            return res.status(200).json({ reply: 'I hear you. I want to keep things safe, so I will avoid repeating sensitive content. It might help to take a short break, breathe slowly, and hydrate. If you are in danger or thinking of harming yourself, please reach out to local helplines or someone you trust immediately.' });
        }

        return res.status(201).json({ id: String(entry._id), reply });
    } catch (err) {
        console.error('createVent error', err);
        return res.status(500).json({ message: 'Failed to create vent entry' });
    }
};

exports.listVents = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user._id || req.user.id;
        const items = await VentEntry.find({ user: userId }).sort({ createdAt: -1 }).lean();
        const mapped = items.map(i => ({ id: String(i._id), text: i.text, createdAt: i.createdAt }));
        return res.status(200).json(mapped);
    } catch (err) {
        console.error('listVents error', err);
        return res.status(500).json({ message: 'Failed to fetch vents' });
    }
};


