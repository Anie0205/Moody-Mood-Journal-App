const { translateClient } = require('../config/gcp');

// Detect language and provide Hindi support
exports.detectLanguage = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'text is required' });

        // Use Google Cloud Translation API to detect language
        const [detection] = await translateClient.detect(text);
        const detectedLanguage = detection.language;
        const confidence = detection.confidence;

        return res.status(200).json({
            language: detectedLanguage,
            confidence: confidence,
            isHindi: detectedLanguage === 'hi',
            isEnglish: detectedLanguage === 'en',
            supported: ['en', 'hi'].includes(detectedLanguage)
        });
    } catch (err) {
        console.error('Language detection error:', err);
        return res.status(500).json({ message: 'Failed to detect language' });
    }
};

// Translate text to Hindi
exports.translateToHindi = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'text is required' });

        const [translation] = await translateClient.translate(text, {
            from: 'en',
            to: 'hi'
        });

        return res.status(200).json({
            originalText: text,
            translatedText: translation,
            targetLanguage: 'hi',
            sourceLanguage: 'en'
        });
    } catch (err) {
        console.error('Translation error:', err);
        return res.status(500).json({ message: 'Failed to translate text' });
    }
};

// Translate text to English
exports.translateToEnglish = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'text is required' });

        const [translation] = await translateClient.translate(text, {
            from: 'hi',
            to: 'en'
        });

        return res.status(200).json({
            originalText: text,
            translatedText: translation,
            targetLanguage: 'en',
            sourceLanguage: 'hi'
        });
    } catch (err) {
        console.error('Translation error:', err);
        return res.status(500).json({ message: 'Failed to translate text' });
    }
};

// Get bilingual prompts for Indian context
exports.getBilingualPrompts = async (req, res) => {
    try {
        const prompts = {
            emotions: {
                'sadness/depression': {
                    en: 'I\'m feeling really down and need support',
                    hi: 'मैं बहुत उदास हूँ और मुझे सहारे की जरूरत है'
                },
                'anxiety/worry': {
                    en: 'I\'m worried about my future and need guidance',
                    hi: 'मैं अपने भविष्य को लेकर चिंतित हूँ और मार्गदर्शन चाहता हूँ'
                },
                'academic_pressure': {
                    en: 'The academic pressure is overwhelming me',
                    hi: 'शैक्षणिक दबाव मुझे अभिभूत कर रहा है'
                },
                'family_expectations': {
                    en: 'My family\'s expectations are too much for me to handle',
                    hi: 'मेरे परिवार की अपेक्षाएं मेरे लिए बहुत ज्यादा हैं'
                }
            },
            contexts: {
                'academic': {
                    en: 'Academic performance and career concerns',
                    hi: 'शैक्षणिक प्रदर्शन और करियर की चिंताएं'
                },
                'family': {
                    en: 'Family relationships and expectations',
                    hi: 'पारिवारिक रिश्ते और अपेक्षाएं'
                },
                'social': {
                    en: 'Social relationships and peer pressure',
                    hi: 'सामाजिक रिश्ते और साथियों का दबाव'
                }
            }
        };

        return res.status(200).json(prompts);
    } catch (err) {
        console.error('Bilingual prompts error:', err);
        return res.status(500).json({ message: 'Failed to get bilingual prompts' });
    }
};
