## Google Cloud Setup (Backend)

1) Project and Auth
- Create or select a GCP project.
- For local dev only: create a Service Account with roles: Firestore User, Secret Manager Secret Accessor, Cloud Natural Language API User. Download JSON key and set `GOOGLE_APPLICATION_CREDENTIALS` to its path.
- In Cloud Run/App Engine, use default service account and grant the same roles (no JSON file needed).

2) Enable APIs
- Firestore API
- Cloud Natural Language API
- Secret Manager API
- Vertex AI API (for Gemini via API key) or use `@google/generative-ai` with API key

3) Firestore
- In `Firestore`, create in Native mode.
- The code uses collection `ventEntries` with fields: `userId:string`, `text:string`, `createdAt:number`.

4) Secrets
- Prefer storing secrets in Secret Manager.
- Create secret `GEMINI_API_KEY` with your Gemini key.
- Note the resource name: `projects/<project>/secrets/GEMINI_API_KEY/versions/latest`.
- Set env var `GEMINI_SECRET_RESOURCE` to that resource name in your deployment.
- For local dev, you can set `GOOGLE_GEMINI_API_KEY`.

5) Environment
- Required: `MONGO_URI`, `JWT_SECRET`.
- Optional: `GOOGLE_APPLICATION_CREDENTIALS`, `GCP_PROJECT_ID`, `GOOGLE_GEMINI_API_KEY`, `GEMINI_SECRET_RESOURCE`.

6) Deployment (Cloud Run)
- Build container with Node 18+.
- Configure env vars above; do not bake secrets into image.
- Ensure service account has Firestore, NL API, Secret Manager roles.

7) CORS
- Update `backend/server.js` CORS origins for your frontend domains.

8) Testing
- `POST /api/chat/anonymous` body `{"message":"..."}`
- `POST /api/vent` body `{"text":"...","anonymous":true}`
- `GET /api/vent` requires `Authorization: Bearer <token>`
- `POST /api/translate/indian-parent` body `{"text":"..."}`


