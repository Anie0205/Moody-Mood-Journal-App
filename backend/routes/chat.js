const express = require('express');
const router = express.Router();
const { anonymousChat } = require('../controllers/chatController');
const safety = require('../middleware/safety');
const crisisDetection = require('../middleware/crisisDetection');
const { sanitizeInput, detectSensitiveData } = require('../middleware/dataSanitization');

// Anonymous, judgment-free conversation (text only)
// Apply data sanitization, crisis detection, then general safety
router.post('/anonymous', sanitizeInput, detectSensitiveData, crisisDetection, safety, anonymousChat);

module.exports = router;


