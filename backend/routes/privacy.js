const express = require('express');
const router = express.Router();
const { 
    getPrivacyPolicy, 
    getUserData, 
    deleteUserData, 
    giveConsent, 
    withdrawConsent, 
    getDataProcessingInfo,
    reportDataBreach 
} = require('../controllers/privacyController');
const auth = require('../middleware/authMiddleware');

// Privacy policy (public)
router.get('/policy', getPrivacyPolicy);

// Data processing transparency (public)
router.get('/processing-info', getDataProcessingInfo);

// User data management (authenticated)
router.get('/my-data', auth, getUserData);
router.delete('/my-data', auth, deleteUserData);

// Consent management (authenticated)
router.post('/consent', auth, giveConsent);
router.delete('/consent', auth, withdrawConsent);

// Data breach reporting (authenticated)
router.post('/breach-report', auth, reportDataBreach);

module.exports = router;
