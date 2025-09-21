# 🔧 Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

### **Database Configuration**
```bash
MONGO_URI=mongodb://localhost:27017/moody
# For production: mongodb+srv://username:password@cluster.mongodb.net/moody
```

### **Authentication**
```bash
JWT_SECRET=your-super-secret-jwt-key-here
# Generate a strong secret: openssl rand -base64 32
```

### **Google Cloud Services**
```bash
# Gemini AI API Key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here
# Alternative: GEMINI_API_KEY=your-gemini-api-key-here

# Google Cloud Project ID
GCP_PROJECT_ID=your-gcp-project-id

# Service Account (for local development)
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
# Alternative: GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
```

### **Server Configuration**
```bash
PORT=5000
NODE_ENV=development
```

### **CORS Configuration**
```bash
FRONTEND_URL=http://localhost:5173
# For production: https://your-domain.com
```

## 🚨 **Critical Issues to Fix**

### 1. **Security Vulnerabilities**
- Remove password logging from auth controller
- Add input sanitization
- Implement rate limiting
- Add CSRF protection

### 2. **Error Handling**
- Add error boundaries in React components
- Implement graceful degradation
- Add proper error logging

### 3. **Production Readiness**
- Add health checks
- Implement monitoring
- Add deployment scripts
- Configure environment-specific settings

## 🔧 **Quick Fixes**

### Fix Auth Controller Logging
```javascript
// Remove this line from authController.js:
console.log("Signup request body:", req.body);
console.log("LOGIN REQUEST", { email, password });
```

### Add Rate Limiting
```bash
npm install express-rate-limit
```

### Add Input Sanitization
```bash
npm install express-validator
```

## 📋 **Checklist for Production**

- [ ] All environment variables set
- [ ] Database connection secured
- [ ] API keys rotated
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] Error monitoring setup
- [ ] Backup strategy implemented
- [ ] Health checks configured
