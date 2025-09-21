const { body, validationResult } = require('express-validator');
const dlpService = require('../services/dlpService');
const { analytics } = require('../controllers/analyticsController');

// Input sanitization and validation
const sanitizeInput = [
    body('text').optional().trim().escape().isLength({ min: 1, max: 5000 }),
    body('message').optional().trim().escape().isLength({ min: 1, max: 5000 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('name').optional().trim().escape().isLength({ min: 1, max: 100 }),
    body('password').optional().isLength({ min: 6, max: 128 }),
    
    // Custom validation
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Invalid input data',
                errors: errors.array()
            });
        }
        next();
    }
];

// DLP-based sensitive data detection
const detectSensitiveData = async (req, res, next) => {
    try {
        const text = req.body?.text || req.body?.message || '';
        if (!text) return next();

        // Check for sensitive information
        const hasSensitive = await dlpService.hasSensitiveInfo(text);
        const sensitivityScore = await dlpService.getSensitivityScore(text);
        const mentalHealthSensitive = await dlpService.detectMentalHealthSensitive(text);

        // Add sensitivity context to request
        req.sensitivityContext = {
            hasSensitive,
            sensitivityScore,
            mentalHealthSensitive,
            timestamp: new Date().toISOString()
        };

        // Log sensitive data detection for analytics
        if (hasSensitive || mentalHealthSensitive.isSensitive) {
            analytics.trackSafetyIncident('sensitive_data_detected', 'MEDIUM', {
                hasSensitive,
                sensitivityScore,
                mentalHealthSensitive,
                endpoint: req.path,
                method: req.method
            });
        }

        // Block if highly sensitive data detected
        if (sensitivityScore > 0.8) {
            return res.status(400).json({
                message: 'Content contains highly sensitive information. Please remove personal identifiers and try again.',
                sensitivityScore,
                blocked: true
            });
        }

        next();
    } catch (error) {
        console.error('Sensitive data detection error:', error);
        // On error, allow through but log the issue
        next();
    }
};

// Data anonymization for analytics
const anonymizeForAnalytics = (data) => {
    const anonymized = { ...data };
    
    // Remove or hash sensitive fields
    if (anonymized.email) {
        anonymized.email = anonymized.email.split('@')[0].substring(0, 2) + '***@' + anonymized.email.split('@')[1];
    }
    
    if (anonymized.name) {
        anonymized.name = anonymized.name.substring(0, 1) + '***';
    }
    
    if (anonymized.text) {
        // Remove potential PII from text
        anonymized.text = anonymized.text
            .replace(/\b\d{10}\b/g, '***PHONE***') // Phone numbers
            .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '***EMAIL***') // Email addresses
            .replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g, '***PAN***') // PAN numbers
            .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '***AADHAAR***'); // Aadhaar numbers
    }
    
    return anonymized;
};

// Data sanitization middleware
const sanitizeData = (req, res, next) => {
    try {
        // Sanitize request body
        if (req.body) {
            req.body = sanitizeRequestBody(req.body);
        }
        
        // Sanitize query parameters
        if (req.query) {
            req.query = sanitizeQueryParams(req.query);
        }
        
        next();
    } catch (error) {
        console.error('Data sanitization error:', error);
        next();
    }
};

// Sanitize request body
const sanitizeRequestBody = (body) => {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(body)) {
        if (typeof value === 'string') {
            // Remove HTML tags and escape special characters
            sanitized[key] = value
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
                .trim();
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeRequestBody(value);
        } else {
            sanitized[key] = value;
        }
    }
    
    return sanitized;
};

// Sanitize query parameters
const sanitizeQueryParams = (query) => {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(query)) {
        if (typeof value === 'string') {
            sanitized[key] = value
                .replace(/[<>\"'&]/g, '')
                .trim();
        } else {
            sanitized[key] = value;
        }
    }
    
    return sanitized;
};

// Data retention and cleanup
const dataRetention = {
    // Define data retention periods
    retentionPeriods: {
        chatMessages: 30, // days
        moodEntries: 365, // days
        analytics: 730, // days
        userData: 1095, // days (3 years)
        crisisLogs: 2555 // days (7 years for legal compliance)
    },
    
    // Check if data should be retained
    shouldRetain: (dataType, createdAt) => {
        const retentionDays = dataRetention.retentionPeriods[dataType] || 365;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
        return new Date(createdAt) > cutoffDate;
    },
    
    // Get data for cleanup
    getDataForCleanup: async (dataType) => {
        const retentionDays = dataRetention.retentionPeriods[dataType] || 365;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
        
        // This would be implemented with actual database queries
        return { cutoffDate, retentionDays };
    }
};

// Privacy compliance middleware
const privacyCompliance = (req, res, next) => {
    // Add privacy headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    
    // Add data processing notice
    res.setHeader('X-Data-Processing', 'anonymized');
    res.setHeader('X-Data-Retention', '30-days');
    
    next();
};

// Consent management
const consentManagement = {
    // Check if user has consented to data processing
    hasConsent: (userId) => {
        // This would check against a consent database
        return true; // Placeholder
    },
    
    // Record consent
    recordConsent: async (userId, consentType, granted) => {
        const consent = {
            userId,
            consentType,
            granted,
            timestamp: new Date().toISOString(),
            ipAddress: 'anonymized',
            userAgent: 'anonymized'
        };
        
        // This would be stored in a consent database
        console.log('Consent recorded:', consent);
        return consent;
    },
    
    // Withdraw consent
    withdrawConsent: async (userId, consentType) => {
        return await consentManagement.recordConsent(userId, consentType, false);
    }
};

// Data export for user requests
const dataExport = {
    // Export user data
    exportUserData: async (userId) => {
        // This would gather all user data from various collections
        const userData = {
            profile: {}, // User profile data
            chatHistory: [], // Chat messages (anonymized)
            moodEntries: [], // Mood journal entries (anonymized)
            analytics: {}, // User analytics (anonymized)
            consent: {}, // Consent records
            exportDate: new Date().toISOString()
        };
        
        return userData;
    },
    
    // Delete user data
    deleteUserData: async (userId) => {
        // This would delete all user data from all collections
        console.log(`Deleting all data for user: ${userId}`);
        return { success: true, deletedAt: new Date().toISOString() };
    }
};

module.exports = {
    sanitizeInput,
    detectSensitiveData,
    sanitizeData,
    anonymizeForAnalytics,
    dataRetention,
    privacyCompliance,
    consentManagement,
    dataExport
};
