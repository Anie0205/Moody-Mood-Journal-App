const express = require('express');
const router = express.Router();
const { createVent, listVents } = require('../controllers/ventController');
const safety = require('../middleware/safety');
const auth = require('../middleware/authMiddleware');

// Private diary creation (requires auth)
router.post('/', auth, safety, createVent);

// List user's vents (requires auth)
router.get('/', auth, listVents);

module.exports = router;


