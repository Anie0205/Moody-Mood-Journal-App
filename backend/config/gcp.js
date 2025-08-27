const {LanguageServiceClient} = require('@google-cloud/language');
const {Firestore} = require('@google-cloud/firestore');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
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

// Ensure Firestore always has a projectId in serverless environments
let inferredProjectId = process.env.FIRESTORE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
if (!inferredProjectId && parsedServiceAccount && parsedServiceAccount.project_id) {
    inferredProjectId = parsedServiceAccount.project_id;
}
const firestore = inferredProjectId ? new Firestore({ projectId: inferredProjectId }) : new Firestore();

module.exports = {
    languageClient,
    firestore,
    initializeGemini,
};


