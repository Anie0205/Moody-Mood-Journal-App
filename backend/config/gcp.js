const {LanguageServiceClient} = require('@google-cloud/language');
const {Firestore} = require('@google-cloud/firestore');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const {GoogleGenerativeAI} = require('@google/generative-ai');

// Prefer Application Default Credentials. For local dev, set GOOGLE_APPLICATION_CREDENTIALS
// Optionally pull secrets from Secret Manager if ENV not set

const secretClient = new SecretManagerServiceClient();

async function accessSecretIfNeeded(secretNameEnvVar) {
    const resourceName = process.env[secretNameEnvVar];
    if (!resourceName) return null;
    try {
        const [version] = await secretClient.accessSecretVersion({ name: resourceName });
        return version.payload.data.toString('utf8');
    } catch (err) {
        console.warn('Secret access failed:', err.message);
        return null;
    }
}

async function initializeGemini() {
    // Read environment variables dynamically each time
    let geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
        const secretValue = await accessSecretIfNeeded('GEMINI_SECRET_RESOURCE');
        if (secretValue) geminiApiKey = secretValue;
    }
    if (!geminiApiKey) {
        console.warn('Gemini API key not configured. Set GOOGLE_GEMINI_API_KEY or GEMINI_API_KEY.');
        return null;
    }
    return new GoogleGenerativeAI(geminiApiKey);
}

const languageClient = new LanguageServiceClient();
const firestore = new Firestore();

module.exports = {
    languageClient,
    firestore,
    initializeGemini,
};


