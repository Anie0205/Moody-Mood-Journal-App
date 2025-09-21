const express = require('express');
const router = express.Router();
const { translateToIndianParent } = require('../controllers/translatorController');
const safety = require('../middleware/safety');
const auth = require('../middleware/authMiddleware');
const { sanitizeInput, detectSensitiveData } = require('../middleware/dataSanitization');

router.post('/indian-parent', auth, sanitizeInput, detectSensitiveData, safety, translateToIndianParent);

module.exports = router;


