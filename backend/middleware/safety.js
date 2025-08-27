const {languageClient} = require('../config/gcp');

// Basic keyword list as a fallback/augmentation
// Note: Avoid overly broad terms like "hate" which can appear in harmless contexts
const bannedPatterns = [
    /\b(kill|suicide|murder)\b/i,
    /\bslur\b/i,
    /\bnsfw\b/i,
    /\bsex(ual)?\b/i,
    /\bporn\b/i,
    /\bracist|racism\b/i,
    /\bharass(ing|ment)?\b/i,
    // Targeted hate or self-directed hate (more likely harmful)
    /\b(i\s+hate\s+myself|i\s+hate\s+you)\b/i,
];

async function analyzeSafety(text) {
    try {
        // Sentiment as heuristic; Natural Language lacks explicit toxicity scoring
        const [sentimentResult] = await languageClient.analyzeSentiment({
            document: { content: text, type: 'PLAIN_TEXT' },
            encodingType: 'UTF8',
        });
        const sentimentScore = sentimentResult.documentSentiment?.score ?? 0;

        // classifyText can help flag sensitive topics when available (requires enough text)
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

        const keywordHit = bannedPatterns.some((re) => re.test(text));

        // Only block when keyword or sensitive topics are detected.
        // Pure negative sentiment alone should not block expression.
        const unsafe = keywordHit || sensitive;
        return { unsafe, sentimentScore };
    } catch (err) {
        // On failure, be conservative but not blocking
        return { unsafe: false, sentimentScore: 0 };
    }
}

function safetyMiddleware(req, res, next) {
    const text = req.body?.text || req.body?.message || '';
    if (!text) return next();
    analyzeSafety(text).then(({ unsafe }) => {
        if (unsafe) {
            return res.status(400).json({ message: 'Content appears unsafe or inappropriate.' });
        }
        next();
    }).catch(() => next());
}

module.exports = safetyMiddleware;
module.exports.analyzeSafety = analyzeSafety;


