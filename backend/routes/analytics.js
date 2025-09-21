const express = require('express');
const router = express.Router();
const { 
    getMetrics, 
    getSafetyMetrics, 
    getCulturalMetrics, 
    getTechnicalMetrics, 
    trackEvent 
} = require('../controllers/analyticsController');

// Analytics and metrics routes
router.get('/metrics', getMetrics);
router.get('/safety', getSafetyMetrics);
router.get('/cultural', getCulturalMetrics);
router.get('/technical', getTechnicalMetrics);
router.post('/track', trackEvent);

module.exports = router;
