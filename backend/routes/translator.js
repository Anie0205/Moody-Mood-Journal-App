const express = require('express');
const router = express.Router();
const { translateToIndianParent } = require('../controllers/translatorController');
const safety = require('../middleware/safety');
const auth = require('../middleware/authMiddleware');

router.post('/indian-parent', auth, safety, translateToIndianParent);

module.exports = router;


