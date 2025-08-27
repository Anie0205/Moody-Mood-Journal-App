const {LanguageServiceClient} = require('@google-cloud/language');
const {GoogleGenerativeAI} = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Prefer Application Default Credentials. For local dev, set GOOGLE_APPLICATION_CREDENTIALS
// On platforms like Render, allow providing the service account JSON via env var
// GOOGLE_APPLICATION_CREDENTIALS_JSON and write it to a temp file automatically.

let parsedServiceAccount = null;
try {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        const targetPath = path.join('/tmp', 'gcp-sa.json');
        const json = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        fs.writeFileSync(targetPath, json, { encoding: 'utf8' });
        try { parsedServiceAccount = JSON.parse(json); } catch (_) { /* ignore */ }
        process.env.GOOGLE_APPLICATION_CREDENTIALS = targetPath;
    }
} catch (err) {
    console.warn('Failed to materialize GOOGLE_APPLICATION_CREDENTIALS_JSON:', err.message);
}

async function initializeGemini() {
    const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        console.warn('Gemini API key not configured. Set GOOGLE_GEMINI_API_KEY or GEMINI_API_KEY.');
        return null;
    }
    return new GoogleGenerativeAI(geminiApiKey);
}

const languageClient = new LanguageServiceClient();

module.exports = {
    languageClient,
    initializeGemini,
};


