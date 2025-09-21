const { dataExport, consentManagement } = require('../middleware/dataSanitization');
const { analytics } = require('./analyticsController');

// Privacy policy and data handling endpoints
exports.getPrivacyPolicy = async (req, res) => {
    try {
        const privacyPolicy = {
            lastUpdated: new Date().toISOString(),
            version: '1.0',
            dataCollection: {
                whatWeCollect: [
                    'Chat messages (anonymized)',
                    'Mood entries (anonymized)',
                    'Usage analytics (anonymized)',
                    'Technical logs (anonymized)'
                ],
                whatWeDontCollect: [
                    'Personal identification information',
                    'Location data',
                    'Contact information',
                    'Financial information'
                ]
            },
            dataUsage: {
                purposes: [
                    'Provide AI-powered emotional support',
                    'Improve service quality',
                    'Ensure user safety',
                    'Generate anonymous analytics'
                ],
                aiProcessing: {
                    description: 'Your messages are processed by Google Cloud AI services for emotional analysis and response generation',
                    dataRetention: 'Messages are anonymized and stored for 30 days maximum',
                    thirdPartyServices: 'Google Cloud Natural Language API, Gemini AI'
                }
            },
            dataProtection: {
                encryption: 'All data is encrypted in transit and at rest',
                access: 'Only authorized personnel can access anonymized data',
                sharing: 'We do not share personal data with third parties',
                dlp: 'Google Cloud DLP is used to detect and protect sensitive information'
            },
            userRights: {
                access: 'You can request a copy of your data',
                deletion: 'You can request deletion of your data',
                correction: 'You can request correction of your data',
                portability: 'You can export your data in a portable format'
            },
            crisisData: {
                specialHandling: 'Crisis-related data is handled with extra care',
                retention: 'Crisis logs are retained for 7 years for legal compliance',
                access: 'Crisis data may be shared with emergency services if required by law'
            },
            contact: {
                email: 'privacy@moody.app',
                address: 'Moody Privacy Team, India',
                responseTime: 'We respond to privacy requests within 30 days'
            }
        };

        return res.status(200).json(privacyPolicy);
    } catch (err) {
        console.error('Privacy policy error:', err);
        return res.status(500).json({ message: 'Failed to get privacy policy' });
    }
};

// Get user's data
exports.getUserData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userData = await dataExport.exportUserData(userId);
        
        // Track data export request
        analytics.trackUserEngagement(userId, 'data_export_requested', {
            timestamp: new Date().toISOString(),
            dataTypes: Object.keys(userData)
        });
        
        return res.status(200).json(userData);
    } catch (err) {
        console.error('Data export error:', err);
        return res.status(500).json({ message: 'Failed to export user data' });
    }
};

// Delete user's data
exports.deleteUserData = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await dataExport.deleteUserData(userId);
        
        // Track data deletion request
        analytics.trackUserEngagement(userId, 'data_deletion_requested', {
            timestamp: new Date().toISOString(),
            success: result.success
        });
        
        return res.status(200).json(result);
    } catch (err) {
        console.error('Data deletion error:', err);
        return res.status(500).json({ message: 'Failed to delete user data' });
    }
};

// Consent management
exports.giveConsent = async (req, res) => {
    try {
        const userId = req.user._id;
        const { consentType } = req.body;
        
        const consent = await consentManagement.recordConsent(userId, consentType, true);
        
        return res.status(200).json({
            message: 'Consent recorded successfully',
            consent
        });
    } catch (err) {
        console.error('Consent recording error:', err);
        return res.status(500).json({ message: 'Failed to record consent' });
    }
};

exports.withdrawConsent = async (req, res) => {
    try {
        const userId = req.user._id;
        const { consentType } = req.body;
        
        const consent = await consentManagement.withdrawConsent(userId, consentType);
        
        return res.status(200).json({
            message: 'Consent withdrawn successfully',
            consent
        });
    } catch (err) {
        console.error('Consent withdrawal error:', err);
        return res.status(500).json({ message: 'Failed to withdraw consent' });
    }
};

// Data processing transparency
exports.getDataProcessingInfo = async (req, res) => {
    try {
        const processingInfo = {
            dataControllers: [
                {
                    name: 'Moody Mental Wellness Platform',
                    contact: 'privacy@moody.app',
                    purpose: 'Mental wellness support for Indian youth'
                }
            ],
            dataProcessors: [
                {
                    name: 'Google Cloud Platform',
                    services: ['Natural Language API', 'Gemini AI', 'Translation API', 'DLP'],
                    purpose: 'AI processing and data protection',
                    location: 'Global (with data residency controls)'
                }
            ],
            legalBasis: {
                primary: 'Legitimate interest in providing mental health support',
                secondary: 'User consent for data processing',
                special: 'Vital interests for crisis intervention'
            },
            dataRetention: {
                chatMessages: '30 days (anonymized)',
                moodEntries: '1 year (anonymized)',
                analytics: '2 years (anonymized)',
                crisisLogs: '7 years (for legal compliance)'
            },
            userRights: {
                access: 'Right to access your data',
                rectification: 'Right to correct your data',
                erasure: 'Right to delete your data',
                portability: 'Right to data portability',
                restriction: 'Right to restrict processing',
                objection: 'Right to object to processing'
            }
        };

        return res.status(200).json(processingInfo);
    } catch (err) {
        console.error('Data processing info error:', err);
        return res.status(500).json({ message: 'Failed to get data processing info' });
    }
};

// Data breach notification (for compliance)
exports.reportDataBreach = async (req, res) => {
    try {
        const { description, severity, affectedUsers } = req.body;
        
        // Log the breach report
        const breachReport = {
            timestamp: new Date().toISOString(),
            description,
            severity,
            affectedUsers,
            reportedBy: req.user._id,
            status: 'reported'
        };
        
        console.error('DATA BREACH REPORTED:', breachReport);
        
        // Track breach report
        analytics.trackSafetyIncident('data_breach_reported', severity, {
            description,
            affectedUsers,
            reportedBy: req.user._id
        });
        
        return res.status(200).json({
            message: 'Data breach report received',
            reportId: `BR-${Date.now()}`,
            status: 'under_investigation'
        });
    } catch (err) {
        console.error('Data breach reporting error:', err);
        return res.status(500).json({ message: 'Failed to report data breach' });
    }
};
